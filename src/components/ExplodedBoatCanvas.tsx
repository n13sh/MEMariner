import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { EXPLODED_SUBSYSTEMS } from '../data/marinerData';
import { Layers, Box, RotateCcw } from 'lucide-react';

export type RenderViewMode = 'pbr' | 'blueprint';

/** External drive for presentation mode: turntable yaw (radians) and explode amount (0..1). */
export interface PresentationState {
  yaw: number;
  explode: number;
}

interface ProjectedHotspot {
  id: string;
  label: string;
  /** Anchor dot on the part */
  x: number;
  y: number;
  /** Label position after de-clustering */
  lx: number;
  ly: number;
  side: 1 | -1;
  visible: boolean;
}

interface ExplodedBoatCanvasProps {
  theme: 'light' | 'dark';
  scrollProgress: number; // 0.0 to 1.0
  activeStageIndex: number;
  selectedSubsystemId: string | null;
  onSelectSubsystem: (subsystemId: string) => void;
  manualExplodeOverride: number | null;
  setManualExplodeOverride: (val: number | null) => void;
  viewMode: RenderViewMode;
  setViewMode: (mode: RenderViewMode) => void;
  /** When set, the model follows this ref instead of scroll (used by the cinematic hero). */
  presentationRef?: React.MutableRefObject<PresentationState>;
  /** Hide the control pill and render on a transparent background. */
  chromeless?: boolean;
  /** Show the named part pins (defaults to true; always clickable). */
  showPins?: boolean;
  /** Optional translated labels for the pins, keyed by subsystem id. */
  pinLabels?: Record<string, string>;
}

export const ExplodedBoatCanvas: React.FC<ExplodedBoatCanvasProps> = ({
  theme,
  scrollProgress,
  activeStageIndex,
  selectedSubsystemId,
  onSelectSubsystem,
  manualExplodeOverride,
  setManualExplodeOverride,
  viewMode,
  setViewMode,
  presentationRef,
  chromeless = false,
  showPins = true,
  pinLabels,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hotspots, setHotspots] = useState<ProjectedHotspot[]>([]);

  const scrollRef = useRef(scrollProgress);
  const stageRef = useRef(activeStageIndex);
  const overrideRef = useRef(manualExplodeOverride);
  const viewModeRef = useRef<RenderViewMode>(viewMode);
  const themeRef = useRef<'light' | 'dark'>(theme);
  const isVisibleRef = useRef(true);
  const onSelectRef = useRef(onSelectSubsystem);
  onSelectRef.current = onSelectSubsystem;
  const pinLabelsRef = useRef(pinLabels);
  pinLabelsRef.current = pinLabels;

  const userOrbitRef = useRef({
    theta: 0,
    phi: 0,
    isDragging: false,
    isHorizontalOrbit: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    lastY: 0,
  });

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    stageRef.current = activeStageIndex;
  }, [activeStageIndex]);

  useEffect(() => {
    overrideRef.current = manualExplodeOverride;
  }, [manualExplodeOverride]);

  useEffect(() => {
    viewModeRef.current = viewMode;
  }, [viewMode]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect mobile touch screen
    const isMobileScreen =
      window.innerWidth < 768 || 'ontouchstart' in window;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      isMobileScreen ? 44 : 36,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      150
    );
    camera.position.set(10.5, 5.0, 11.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobileScreen, // Optimized for mobile GPUs
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(
      chromeless
        ? Math.min(window.devicePixelRatio, isMobileScreen ? 1.5 : 1.75)
        : Math.min(window.devicePixelRatio, isMobileScreen ? 1.5 : 2)
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isMobileScreen; // Disable heavy real-time shadows on mobile for locked 60fps
    if (!isMobileScreen) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // CRITICAL: Ensure touch events pass through vertically for natural mobile page scrolling
    renderer.domElement.style.touchAction = 'pan-y';

    // Image-based lighting so clearcoat, gelcoat and stainless pick up soft reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.9;
    pmrem.dispose();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);
    // Sky / water bounce light for a more natural outdoor read
    const hemi = new THREE.HemisphereLight(0xdcefff, 0x9fc4e0, 0.75);
    scene.add(hemi);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
    keyLight.position.set(12, 18, 14);
    if (!isMobileScreen) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = chromeless ? 1024 : 2048;
      keyLight.shadow.mapSize.height = chromeless ? 1024 : 2048;
      keyLight.shadow.radius = 4;
      keyLight.shadow.bias = -0.0005;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9cd3ff, 1.1);
    rimLight.position.set(-14, 8, -10);
    scene.add(rimLight);

    const underHullGlow = new THREE.PointLight(0x1b75bc, 1.0, 18);
    underHullGlow.position.set(0, -2.5, 0);
    scene.add(underHullGlow);

    // Soft contact shadow under the vessel
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext('2d');
    if (sctx) {
      const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 128);
      grad.addColorStop(0, 'rgba(10, 25, 50, 0.55)');
      grad.addColorStop(0.45, 'rgba(10, 25, 50, 0.22)');
      grad.addColorStop(1, 'rgba(10, 25, 50, 0)');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const contactShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(13, 7.5),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
        opacity: chromeless ? 0.55 : 1,
      })
    );
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.set(0.2, -2.3, 0);
    scene.add(contactShadow);

    // Soft water disc beneath the vessel
    const waterCanvas = document.createElement('canvas');
    waterCanvas.width = 512;
    waterCanvas.height = 512;
    const wctx = waterCanvas.getContext('2d');
    if (wctx) {
      const g = wctx.createRadialGradient(256, 256, 20, 256, 256, 256);
      g.addColorStop(0, 'rgba(160, 205, 235, 0.85)');
      g.addColorStop(0.55, 'rgba(190, 220, 240, 0.45)');
      g.addColorStop(1, 'rgba(210, 230, 245, 0)');
      wctx.fillStyle = g;
      wctx.fillRect(0, 0, 512, 512);
      wctx.strokeStyle = 'rgba(255,255,255,0.35)';
      wctx.lineWidth = 2;
      for (let r = 70; r < 250; r += 45) {
        wctx.beginPath();
        wctx.ellipse(256, 256, r, r * 0.92, 0, 0, Math.PI * 2);
        wctx.stroke();
      }
    }
    const waterTex = new THREE.CanvasTexture(waterCanvas);
    waterTex.colorSpace = THREE.SRGBColorSpace;
    const waterDisc = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 9),
      new THREE.MeshBasicMaterial({ map: waterTex, transparent: true, depthWrite: false })
    );
    waterDisc.rotation.x = -Math.PI / 2;
    waterDisc.position.set(0.2, -2.34, 0);
    scene.add(waterDisc);

    // Faint reference ring
    const gridGroup = new THREE.Group();
    const polarGrid = new THREE.PolarGridHelper(13, 12, 6, 64, 0x1b75bc, 0x94a3b8);
    polarGrid.position.y = -2.32;
    (polarGrid.material as THREE.Material).transparent = true;
    (polarGrid.material as THREE.Material).opacity = chromeless ? 0.0 : 0.06;
    gridGroup.add(polarGrid);
    if (!chromeless) scene.add(gridGroup);

    // Procedural teak planking texture
    const teakCanvas = document.createElement('canvas');
    teakCanvas.width = 512;
    teakCanvas.height = 512;
    const tctx = teakCanvas.getContext('2d');
    if (tctx) {
      tctx.fillStyle = '#c9956a';
      tctx.fillRect(0, 0, 512, 512);
      const plank = 64;
      for (let i = 0; i < 512 / plank; i++) {
        const shade = 0.9 + Math.random() * 0.2;
        tctx.fillStyle = `rgb(${Math.round(201 * shade)}, ${Math.round(149 * shade)}, ${Math.round(106 * shade)})`;
        tctx.fillRect(0, i * plank, 512, plank);
        tctx.strokeStyle = 'rgba(90, 55, 30, 0.18)';
        tctx.lineWidth = 1;
        for (let k = 0; k < 10; k++) {
          const y = i * plank + 4 + Math.random() * (plank - 8);
          tctx.beginPath();
          tctx.moveTo(0, y);
          for (let x = 0; x <= 512; x += 32) tctx.lineTo(x, y + Math.sin((x + k * 40) / 50) * 1.5);
          tctx.stroke();
        }
        tctx.fillStyle = '#2b2b2b';
        tctx.fillRect(0, i * plank, 512, 3);
      }
    }
    const teakTex = new THREE.CanvasTexture(teakCanvas);
    teakTex.colorSpace = THREE.SRGBColorSpace;
    teakTex.wrapS = THREE.RepeatWrapping;
    teakTex.wrapT = THREE.RepeatWrapping;
    teakTex.repeat.set(0.9, 0.9);
    teakTex.anisotropy = 4;

    // Materials
    const materials = {
      whiteGelcoatHull: new THREE.MeshPhysicalMaterial({
        color: 0xf4f6f8,
        metalness: 0.0,
        roughness: 0.18,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide,
      }),
      navyHull: new THREE.MeshPhysicalMaterial({
        color: 0x092c58,
        metalness: 0.15,
        roughness: 0.14,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
        side: THREE.DoubleSide,
      }),
      arcticWhiteGelcoat: new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.05,
        roughness: 0.16,
        clearcoat: 0.9,
        clearcoatRoughness: 0.08,
        side: THREE.DoubleSide,
      }),
      structuralGrpStringer: new THREE.MeshStandardMaterial({
        color: 0x1b75bc,
        metalness: 0.25,
        roughness: 0.35,
      }),
      teakDeck: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: teakTex,
        metalness: 0.02,
        roughness: 0.55,
      }),
      stainless316: new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        metalness: 0.9,
        roughness: 0.14,
      }),
      anodizedAluminum: new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.75,
        roughness: 0.28,
      }),
      engineBlockDark: new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.25,
      }),
      engineCowlingMetallic: new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        metalness: 0.6,
        roughness: 0.18,
        clearcoat: 1.0,
      }),
      oemGoldFilter: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.55,
        roughness: 0.25,
      }),
      copperCoils: new THREE.MeshStandardMaterial({
        color: 0xd97706,
        metalness: 0.85,
        roughness: 0.2,
      }),
      hvacChillerCyan: new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.45,
        roughness: 0.3,
      }),
      hydraulicEmerald: new THREE.MeshStandardMaterial({
        color: 0x059669,
        metalness: 0.6,
        roughness: 0.22,
      }),
      radarElectronicsGlow: new THREE.MeshStandardMaterial({
        color: 0x0ea5e9,
        metalness: 0.35,
        roughness: 0.2,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
      }),
      tintedAcrylic: new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.42,
        metalness: 0.1,
        roughness: 0.05,
      }),
      marineUpholstery: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        metalness: 0.05,
        roughness: 0.4,
      }),
    };

    // Rounded box helper: softens every hard edge on the model
    const rbox = (w: number, h: number, d: number, r = 0.06) =>
      new RoundedBoxGeometry(w, h, d, 3, Math.min(r, Math.min(w, h, d) / 2.2));

    const registeredMeshes: {
      mesh: THREE.Mesh;
      baseMat: THREE.Material;
      subsystemId: string;
    }[] = [];

    const registerMesh = (
      mesh: THREE.Mesh,
      baseMat: THREE.Material,
      subsystemId: string
    ) => {
      mesh.userData.subsystemId = subsystemId;
      registeredMeshes.push({ mesh, baseMat, subsystemId });
      return mesh;
    };

    const vesselRoot = new THREE.Group();
    scene.add(vesselRoot);
    const mainDeckGroup = new THREE.Group();

    // 1. HULL & STRINGERS
    const outerHullGroup = new THREE.Group();
    const stringerGridGroup = new THREE.Group();
    vesselRoot.add(outerHullGroup);
    vesselRoot.add(stringerGridGroup);
    vesselRoot.add(mainDeckGroup);

    const buildHullGeometry = () => {
      const stations = 40;
      const positions: number[] = [];
      const indices: number[] = [];

      const getStationProfile = (u: number): [number, number, number][] => {
        const x = -3.6 + u * 8.1;
        const beamFactor =
          u < 0.55
            ? 1.0 + 0.08 * Math.sin((u / 0.55) * Math.PI)
            : Math.pow(1 - (u - 0.55) / 0.45, 0.72);
        const halfBeam = 1.58 * beamFactor;
        const keelY =
          u < 0.78
            ? -1.05 + u * 0.12
            : -0.95 + Math.pow((u - 0.78) / 0.22, 1.6) * 1.45;
        const sheerY = 0.28 + Math.pow(u, 1.8) * 0.58;
        const chineY = keelY + (sheerY - keelY) * 0.36;

        return [
          [x, sheerY, -halfBeam * 1.04],
          [x, sheerY - 0.08, -halfBeam],
          [x, (sheerY + chineY) * 0.52, -halfBeam * 0.96],
          [x, chineY + 0.05, -halfBeam * 0.88],
          [x, chineY, -halfBeam * 0.78],
          [x, (chineY + keelY) * 0.55, -halfBeam * 0.42],
          [x, keelY + 0.06, -halfBeam * 0.14],
          [x, keelY, 0],
          [x, keelY + 0.06, halfBeam * 0.14],
          [x, (chineY + keelY) * 0.55, halfBeam * 0.42],
          [x, chineY, halfBeam * 0.78],
          [x, chineY + 0.05, halfBeam * 0.88],
          [x, (sheerY + chineY) * 0.52, halfBeam * 0.96],
          [x, sheerY - 0.08, halfBeam],
          [x, sheerY, halfBeam * 1.04],
        ];
      };

      const cols = 15;
      for (let i = 0; i <= stations; i++) {
        const row = getStationProfile(i / stations);
        for (let j = 0; j < cols; j++) {
          positions.push(row[j][0], row[j][1], row[j][2]);
        }
      }
      for (let i = 0; i < stations; i++) {
        for (let j = 0; j < cols - 1; j++) {
          const a = i * cols + j;
          const b = (i + 1) * cols + j;
          const c = (i + 1) * cols + (j + 1);
          const d = i * cols + (j + 1);
          indices.push(a, b, d, b, c, d);
        }
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    };

    outerHullGroup.add(
      registerMesh(
        new THREE.Mesh(buildHullGeometry(), materials.whiteGelcoatHull),
        materials.whiteGelcoatHull,
        'hull-fabrication'
      )
    );

    const transomMesh = registerMesh(
      new THREE.Mesh(
        rbox(0.14, 1.15, 3.05),
        materials.whiteGelcoatHull
      ),
      materials.whiteGelcoatHull,
      'hull-fabrication'
    );
    transomMesh.position.set(-3.55, -0.32, 0);
    outerHullGroup.add(transomMesh);

    // Stainless rub rails along the sheer line, port and starboard
    const sheerPoint = (u: number, side: number): THREE.Vector3 => {
      const x = -3.6 + u * 8.1;
      const beamFactor =
        u < 0.55
          ? 1.0 + 0.08 * Math.sin((u / 0.55) * Math.PI)
          : Math.pow(1 - (u - 0.55) / 0.45, 0.72);
      const halfBeam = 1.58 * beamFactor;
      const sheerY = 0.28 + Math.pow(u, 1.8) * 0.58;
      return new THREE.Vector3(x, sheerY + 0.01, side * halfBeam * 1.04);
    };
    [-1, 1].forEach((side) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 40; i++) pts.push(sheerPoint(i / 40, side));
      const rail = registerMesh(
        new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.035, 10, false),
          materials.stainless316
        ),
        materials.stainless316,
        'hull-fabrication'
      );
      outerHullGroup.add(rail);
    });

    // Navy boot stripe along the chine, port and starboard
    const chinePoint = (u: number, side: number): THREE.Vector3 => {
      const x = -3.6 + u * 8.1;
      const beamFactor =
        u < 0.55
          ? 1.0 + 0.08 * Math.sin((u / 0.55) * Math.PI)
          : Math.pow(1 - (u - 0.55) / 0.45, 0.72);
      const halfBeam = 1.58 * beamFactor;
      const keelY =
        u < 0.78
          ? -1.05 + u * 0.12
          : -0.95 + Math.pow((u - 0.78) / 0.22, 1.6) * 1.45;
      const sheerY = 0.28 + Math.pow(u, 1.8) * 0.58;
      const chineY = keelY + (sheerY - keelY) * 0.36;
      return new THREE.Vector3(x, chineY + 0.09, side * halfBeam * 0.905);
    };
    [-1, 1].forEach((side) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 40; i++) pts.push(chinePoint(i / 40, side));
      const stripe = registerMesh(
        new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 60, 0.055, 8, false),
          materials.navyHull
        ),
        materials.navyHull,
        'hull-fabrication'
      );
      outerHullGroup.add(stripe);
    });

    // Navigation lights at the bow: red to port, green to starboard
    const navLights: [number, number][] = [
      [0xff2d2d, -1],
      [0x2dff6a, 1],
    ];
    navLights.forEach(([color, side]) => {
      const lamp = registerMesh(
        new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 12, 12),
          new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.3 })
        ),
        materials.stainless316,
        'assembled-overview'
      );
      lamp.position.set(3.55, 0.93, side * 0.66);
      mainDeckGroup.add(lamp);
    });

    // Bow pulpit rail with stanchions
    const bowRailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.4, 0.95, -1.42),
      new THREE.Vector3(2.6, 1.02, -1.2),
      new THREE.Vector3(3.7, 1.1, -0.6),
      new THREE.Vector3(4.25, 1.14, 0),
      new THREE.Vector3(3.7, 1.1, 0.6),
      new THREE.Vector3(2.6, 1.02, 1.2),
      new THREE.Vector3(1.4, 0.95, 1.42),
    ]);
    const bowRail = registerMesh(
      new THREE.Mesh(new THREE.TubeGeometry(bowRailCurve, 48, 0.03, 10, false), materials.stainless316),
      materials.stainless316,
      'assembled-overview'
    );
    mainDeckGroup.add(bowRail);
    [
      [1.4, 0.62, -1.42],
      [1.4, 0.62, 1.42],
      [2.6, 0.66, -1.2],
      [2.6, 0.66, 1.2],
      [3.7, 0.74, -0.6],
      [3.7, 0.74, 0.6],
    ].forEach(([x, y, z]) => {
      const st = registerMesh(
        new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.62, 8), materials.stainless316),
        materials.stainless316,
        'assembled-overview'
      );
      st.position.set(x, y, z);
      mainDeckGroup.add(st);
    });

    [-0.95, -0.35, 0.35, 0.95].forEach((zPos) => {
      const len = Math.abs(zPos) < 0.5 ? 6.6 : 5.4;
      const sMesh = registerMesh(
        new THREE.Mesh(
          rbox(len, 0.34, 0.08),
          materials.structuralGrpStringer
        ),
        materials.structuralGrpStringer,
        'hull-fabrication'
      );
      sMesh.position.set(-0.4, -0.62, zPos);
      stringerGridGroup.add(sMesh);
    });

    [-2.8, -1.6, -0.4, 0.8, 1.9, 2.9].forEach((xPos, idx) => {
      const width = idx >= 4 ? 1.8 - (idx - 3) * 0.45 : 2.55;
      const bMesh = registerMesh(
        new THREE.Mesh(
          rbox(0.08, 0.38, width),
          materials.structuralGrpStringer
        ),
        materials.structuralGrpStringer,
        'hull-fabrication'
      );
      bMesh.position.set(xPos, -0.6, 0);
      stringerGridGroup.add(bMesh);
    });

    // 2. HVAC, FUEL & FILTERS
    const hvacAndAuxGroup = new THREE.Group();
    vesselRoot.add(hvacAndAuxGroup);

    [-0.68, 0.68].forEach((z) => {
      const tank = registerMesh(
        new THREE.Mesh(
          rbox(2.35, 0.38, 0.48, 0.12),
          materials.anodizedAluminum
        ),
        materials.anodizedAluminum,
        'hvac-auxiliary'
      );
      tank.position.set(-0.65, -0.25, z);
      hvacAndAuxGroup.add(tank);

      const filterCanister = registerMesh(
        new THREE.Mesh(
          new THREE.CylinderGeometry(0.09, 0.09, 0.28, 16),
          materials.oemGoldFilter
        ),
        materials.oemGoldFilter,
        'hvac-auxiliary'
      );
      filterCanister.position.set(-2.05, -0.1, z * 0.85);
      hvacAndAuxGroup.add(filterCanister);
    });

    const chillerHousing = registerMesh(
      new THREE.Mesh(
        rbox(1.15, 0.52, 0.72, 0.1),
        materials.hvacChillerCyan
      ),
      materials.hvacChillerCyan,
      'hvac-auxiliary'
    );
    chillerHousing.position.set(0.95, -0.16, 0);
    hvacAndAuxGroup.add(chillerHousing);

    for (let i = 0; i < 4; i++) {
      const coil = registerMesh(
        new THREE.Mesh(
          new THREE.TorusGeometry(0.18, 0.035, 10, 20),
          materials.copperCoils
        ),
        materials.copperCoils,
        'hvac-auxiliary'
      );
      coil.rotation.y = Math.PI / 2;
      coil.position.set(0.68 + i * 0.18, 0.14, 0);
      hvacAndAuxGroup.add(coil);
    }

    // 3. MAIN DECK & HARDWARE

    const deckShape = new THREE.Shape();
    deckShape.moveTo(-3.45, -1.42);
    deckShape.lineTo(1.2, -1.48);
    deckShape.quadraticCurveTo(3.2, -1.25, 4.25, 0);
    deckShape.quadraticCurveTo(3.2, 1.25, 1.2, 1.48);
    deckShape.lineTo(-3.45, 1.42);
    deckShape.closePath();

    const deckExtrude = new THREE.ExtrudeGeometry(deckShape, {
      depth: 0.1,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
    deckExtrude.rotateX(-Math.PI / 2);
    const deckMesh = registerMesh(
      new THREE.Mesh(deckExtrude, materials.teakDeck),
      materials.teakDeck,
      'assembled-overview'
    );
    deckMesh.position.y = 0.22;
    mainDeckGroup.add(deckMesh);

    const bowSunpad = registerMesh(
      new THREE.Mesh(
        rbox(1.95, 0.24, 1.55, 0.1),
        materials.marineUpholstery
      ),
      materials.marineUpholstery,
      'assembled-overview'
    );
    bowSunpad.position.set(2.35, 0.42, 0);
    mainDeckGroup.add(bowSunpad);

    [-0.38, 0.38].forEach((z) => {
      const seat = registerMesh(
        new THREE.Mesh(
          rbox(0.52, 0.58, 0.52, 0.12),
          materials.marineUpholstery
        ),
        materials.marineUpholstery,
        'assembled-overview'
      );
      seat.position.set(-0.85, 0.62, z);
      mainDeckGroup.add(seat);
    });

    const aftBench = registerMesh(
      new THREE.Mesh(
        rbox(0.58, 0.46, 2.35, 0.12),
        materials.marineUpholstery
      ),
      materials.marineUpholstery,
      'assembled-overview'
    );
    aftBench.position.set(-2.95, 0.52, 0);
    mainDeckGroup.add(aftBench);

    // 4. RADAR, T-TOP & HELM ELECTRONICS
    const radarElectronicsGroup = new THREE.Group();
    vesselRoot.add(radarElectronicsGroup);

    const consoleBase = registerMesh(
      new THREE.Mesh(
        rbox(1.35, 1.05, 1.25, 0.14),
        materials.arcticWhiteGelcoat
      ),
      materials.arcticWhiteGelcoat,
      'radar-electronics'
    );
    consoleBase.position.set(0.15, 0.82, 0);
    radarElectronicsGroup.add(consoleBase);

    const mfdScreen = registerMesh(
      new THREE.Mesh(
        rbox(0.12, 0.36, 0.96),
        materials.radarElectronicsGlow
      ),
      materials.radarElectronicsGlow,
      'radar-electronics'
    );
    mfdScreen.rotation.z = -0.35;
    mfdScreen.position.set(-0.48, 1.18, 0);
    radarElectronicsGroup.add(mfdScreen);

    const windscreen = registerMesh(
      new THREE.Mesh(
        rbox(0.85, 0.55, 1.18, 0.12),
        materials.tintedAcrylic
      ),
      materials.tintedAcrylic,
      'radar-electronics'
    );
    windscreen.position.set(0.18, 1.52, 0);
    radarElectronicsGroup.add(windscreen);

    [
      [-0.45, -0.58],
      [-0.45, 0.58],
      [0.65, -0.54],
      [0.65, 0.54],
    ].forEach(([x, z]) => {
      const strut = registerMesh(
        new THREE.Mesh(
          new THREE.CylinderGeometry(0.036, 0.042, 1.65, 8),
          materials.stainless316
        ),
        materials.stainless316,
        'radar-electronics'
      );
      strut.position.set(x, 1.55, z);
      radarElectronicsGroup.add(strut);
    });

    const hardtop = registerMesh(
      new THREE.Mesh(
        rbox(2.65, 0.11, 1.85, 0.05),
        materials.navyHull
      ),
      materials.navyHull,
      'radar-electronics'
    );
    hardtop.position.set(-0.05, 2.38, 0);
    radarElectronicsGroup.add(hardtop);

    const radarPedestal = registerMesh(
      new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.14, 24), materials.arcticWhiteGelcoat),
      materials.arcticWhiteGelcoat,
      'radar-electronics'
    );
    radarPedestal.position.set(0.15, 2.5, 0);
    radarElectronicsGroup.add(radarPedestal);

    const radarScannerBar = registerMesh(
      new THREE.Mesh(rbox(0.16, 0.09, 1.1, 0.045), materials.radarElectronicsGlow),
      materials.radarElectronicsGlow,
      'radar-electronics'
    );
    radarScannerBar.position.set(0.15, 2.62, 0);
    radarElectronicsGroup.add(radarScannerBar);

    [-0.75, 0.75].forEach((z) => {
      const antenna = registerMesh(
        new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.9, 8), materials.stainless316),
        materials.stainless316,
        'radar-electronics'
      );
      antenna.position.set(-0.9, 2.86, z);
      radarElectronicsGroup.add(antenna);
    });

    // 5. TWIN ENGINES & PROPELLERS
    const twinEnginesGroup = new THREE.Group();
    const upperCowlingsSubGroup = new THREE.Group();
    const propellersList: THREE.Object3D[] = [];
    twinEnginesGroup.add(upperCowlingsSubGroup);
    vesselRoot.add(twinEnginesGroup);

    [-0.68, 0.68].forEach((zOffset, idx) => {
      const engineUnit = new THREE.Group();
      engineUnit.position.set(-3.88, -0.05, zOffset);
      twinEnginesGroup.add(engineUnit);

      const v8Block = registerMesh(
        new THREE.Mesh(
          rbox(0.68, 0.64, 0.44, 0.08),
          materials.engineBlockDark
        ),
        materials.engineBlockDark,
        'twin-propulsion'
      );
      v8Block.position.set(0, 0.62, 0);
      engineUnit.add(v8Block);

      const oilFilter = registerMesh(
        new THREE.Mesh(
          new THREE.CylinderGeometry(0.075, 0.075, 0.2, 12),
          materials.oemGoldFilter
        ),
        materials.oemGoldFilter,
        'twin-propulsion'
      );
      oilFilter.rotation.x = Math.PI / 2;
      oilFilter.position.set(0.12, 0.58, idx === 0 ? -0.26 : 0.26);
      engineUnit.add(oilFilter);

      const cowling = registerMesh(
        new THREE.Mesh(
          rbox(0.82, 0.82, 0.56, 0.16),
          materials.engineCowlingMetallic
        ),
        materials.engineCowlingMetallic,
        'twin-propulsion'
      );
      cowling.position.set(-3.88, 0.65, zOffset);
      upperCowlingsSubGroup.add(cowling);

      const midLeg = registerMesh(
        new THREE.Mesh(
          rbox(0.36, 0.92, 0.24, 0.1),
          materials.engineCowlingMetallic
        ),
        materials.engineCowlingMetallic,
        'twin-propulsion'
      );
      midLeg.position.set(-0.06, -0.18, 0);
      engineUnit.add(midLeg);

      const torpedo = registerMesh(
        new THREE.Mesh(
          new THREE.CapsuleGeometry(0.11, 0.6, 6, 16),
          materials.anodizedAluminum
        ),
        materials.anodizedAluminum,
        'twin-propulsion'
      );
      torpedo.rotation.z = Math.PI / 2;
      torpedo.position.set(-0.1, -0.78, 0);
      engineUnit.add(torpedo);

      const propGroup = new THREE.Group();
      propGroup.position.set(-0.5, -0.78, 0);
      for (let b = 0; b < 4; b++) {
        const blade = registerMesh(
          new THREE.Mesh(
            rbox(0.03, 0.24, 0.11),
            materials.stainless316
          ),
          materials.stainless316,
          'twin-propulsion'
        );
        const angle = (b * Math.PI) / 2;
        blade.position.set(0, Math.cos(angle) * 0.14, Math.sin(angle) * 0.14);
        blade.rotation.x = angle + (idx === 0 ? 0.35 : -0.35);
        propGroup.add(blade);
      }
      engineUnit.add(propGroup);
      propellersList.push(propGroup);
    });

    // 6. HYDRAULIC STEERING & TRIM TABS
    const steeringHydraulicsGroup = new THREE.Group();
    vesselRoot.add(steeringHydraulicsGroup);

    const tieBar = registerMesh(
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.032, 0.032, 1.45, 12),
        materials.stainless316
      ),
      materials.stainless316,
      'steering-hydraulics'
    );
    tieBar.rotation.x = Math.PI / 2;
    tieBar.position.set(-3.48, 0.22, 0);
    steeringHydraulicsGroup.add(tieBar);

    [-1.12, 1.12].forEach((z) => {
      const trimPlane = registerMesh(
        new THREE.Mesh(
          rbox(0.45, 0.03, 0.42),
          materials.stainless316
        ),
        materials.stainless316,
        'steering-hydraulics'
      );
      trimPlane.rotation.z = 0.15;
      trimPlane.position.set(-3.75, -0.78, z);
      steeringHydraulicsGroup.add(trimPlane);

      const trimActuator = registerMesh(
        new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.42, 10),
          materials.hydraulicEmerald
        ),
        materials.hydraulicEmerald,
        'steering-hydraulics'
      );
      trimActuator.rotation.z = -0.45;
      trimActuator.position.set(-3.68, -0.58, z);
      steeringHydraulicsGroup.add(trimActuator);
    });

    // Hotspot Anchors
    const hotspotAnchors = [
      {
        id: 'radar-electronics',
        label: 'Electronics & Radar',
        group: radarElectronicsGroup,
        localOffset: new THREE.Vector3(0.15, 2.65, 0),
      },
      {
        id: 'twin-propulsion',
        label: 'Engines & Propellers',
        group: twinEnginesGroup,
        localOffset: new THREE.Vector3(-3.95, 0.72, 0.68),
      },
      {
        id: 'steering-hydraulics',
        label: 'Hydraulics & Trim',
        group: steeringHydraulicsGroup,
        localOffset: new THREE.Vector3(-3.65, -0.45, -1.12),
      },
      {
        id: 'hvac-auxiliary',
        label: 'Marine A/C & Fuel',
        group: hvacAndAuxGroup,
        localOffset: new THREE.Vector3(0.95, 0.14, 0.38),
      },
      {
        id: 'hull-fabrication',
        label: 'Hull & Stringers',
        group: stringerGridGroup,
        localOffset: new THREE.Vector3(2.7, -0.55, 1.0),
      },
      {
        id: 'assembled-overview',
        label: 'Deck & Hardware',
        group: mainDeckGroup,
        localOffset: new THREE.Vector3(2.4, 0.6, -0.9),
      },
    ];

    // Pointer Drag to Orbit (Horizontal only on mobile touch, full 2-axis on desktop mouse)
    const handlePointerDown = (e: PointerEvent) => {
      userOrbitRef.current.isDragging = true;
      userOrbitRef.current.isHorizontalOrbit = e.pointerType === 'mouse';
      userOrbitRef.current.startX = e.clientX;
      userOrbitRef.current.startY = e.clientY;
      userOrbitRef.current.lastX = e.clientX;
      userOrbitRef.current.lastY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!userOrbitRef.current.isDragging) return;
      const totalDx = Math.abs(e.clientX - userOrbitRef.current.startX);
      const totalDy = Math.abs(e.clientY - userOrbitRef.current.startY);

      if (!userOrbitRef.current.isHorizontalOrbit) {
        if (totalDx > 12 && totalDx > totalDy * 1.5) {
          userOrbitRef.current.isHorizontalOrbit = true;
        } else if (totalDy > 8) {
          userOrbitRef.current.isDragging = false;
          return;
        }
      }

      if (userOrbitRef.current.isHorizontalOrbit) {
        const dx = e.clientX - userOrbitRef.current.lastX;
        const dy = e.clientY - userOrbitRef.current.lastY;
        userOrbitRef.current.theta -= dx * 0.007;
        if (e.pointerType === 'mouse') {
          userOrbitRef.current.phi = Math.max(
            -0.3,
            Math.min(0.5, userOrbitRef.current.phi + dy * 0.005)
          );
        }
      }

      userOrbitRef.current.lastX = e.clientX;
      userOrbitRef.current.lastY = e.clientY;
    };

    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    const pickableMeshes = registeredMeshes.map((r) => r.mesh);
    // Per-marker occluders: every mesh except the marker's own system
    const occlusionRay = new THREE.Raycaster();
    const occluderCache = new Map<string, THREE.Mesh[]>();
    hotspotAnchors.forEach((h) => {
      occluderCache.set(
        h.id,
        registeredMeshes.filter((r) => r.subsystemId !== h.id).map((r) => r.mesh)
      );
    });

    const handlePointerUp = (e: PointerEvent) => {
      const moved =
        Math.abs(e.clientX - userOrbitRef.current.startX) +
        Math.abs(e.clientY - userOrbitRef.current.startY);
      const wasDragging = userOrbitRef.current.isDragging;
      userOrbitRef.current.isDragging = false;
      userOrbitRef.current.isHorizontalOrbit = false;
      // A tap without movement on the canvas selects the part under the pointer
      if (!wasDragging || moved > 6 || e.target !== renderer.domElement) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      raycaster.setFromCamera(pointerNdc, camera);
      const hit = raycaster.intersectObjects(pickableMeshes, false)[0];
      const id = hit?.object.userData.subsystemId as string | undefined;
      if (id) onSelectRef.current(id);
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('pointerdown', handlePointerDown, {
      passive: true,
    });
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });

    // MOBILE PERFORMANCE: Intersection Observer stops WebGL render loop when scrolled offscreen!
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let smoothScroll = scrollRef.current;
    let lastNow = 0;
    const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const currentCamPos = new THREE.Vector3(10.5, 5.2, 11.5);
    const currentCamTarget = new THREE.Vector3(0, 0.4, 0);
    let animFrameId = 0;
    let lastHotspotSync = 0;

    const blueprintMatDark = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });

    const blueprintMatLight = new THREE.MeshBasicMaterial({
      color: 0x092c58,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });

    const animate = (now: number) => {
      animFrameId = requestAnimationFrame(animate);

      // Skip render calculations when scrolled offscreen to conserve phone battery & keep 60fps!
      if (!isVisibleRef.current) return;

      const dt = Math.min(0.05, lastNow ? (now - lastNow) / 1000 : 0.016);
      lastNow = now;
      const scrollDamp = 1 - Math.exp(-dt * 5.5);
      const camDamp = 1 - Math.exp(-dt * 4.2);

      const targetProgress =
        overrideRef.current !== null
          ? overrideRef.current
          : scrollRef.current;
      smoothScroll += (targetProgress - smoothScroll) * scrollDamp;

      const pres = presentationRef?.current;
      const rawExplode = pres
        ? Math.max(0, Math.min(1, pres.explode))
        : Math.max(0, Math.min(1, (smoothScroll - 0.04) / 0.85));
      const globalExplode = pres ? rawExplode : easeInOut(rawExplode);
      const stg = pres ? 0 : stageRef.current;

      // Part separation (eased, with the active stage pulled slightly further)
      const emphasis = (stageIdx: number) => (stg === stageIdx ? 1.25 : 1);
      radarElectronicsGroup.position.y = 1.55 * globalExplode * emphasis(1);
      radarScannerBar.rotation.y = now * 0.0016;

      mainDeckGroup.position.y = 0.75 * globalExplode;
      hvacAndAuxGroup.position.y = 0.32 * globalExplode * emphasis(4);

      twinEnginesGroup.position.x = -1.8 * globalExplode * emphasis(2);
      upperCowlingsSubGroup.position.y = 0.8 * globalExplode;

      propellersList.forEach((prop, idx) => {
        prop.rotation.x = now * (0.003 + 0.006 * globalExplode) * (idx === 0 ? 1 : -1);
      });

      steeringHydraulicsGroup.position.x = -0.95 * globalExplode * emphasis(3);
      steeringHydraulicsGroup.position.y = -0.3 * globalExplode;

      stringerGridGroup.position.y = -0.28 * globalExplode;
      outerHullGroup.position.y = -1.1 * globalExplode;

      // Gentle sea motion: bob, roll and a slow sway
      vesselRoot.rotation.z = Math.sin(now * 0.0009) * 0.012;
      vesselRoot.rotation.x = Math.sin(now * 0.0007 + 1.2) * 0.008;
      vesselRoot.rotation.y = (pres ? pres.yaw : 0) + Math.sin(now * 0.00025) * 0.05;
      contactShadow.material.opacity = (chromeless ? 0.55 : 1) * (1 - globalExplode * 0.35);
      vesselRoot.position.y = Math.sin(now * 0.0015) * 0.05;

      // Mobile Portrait Viewport & Camera Placement
      const width = container.clientWidth;
      const height = container.clientHeight;
      const aspect = width / Math.max(1, height);
      const isPortraitMobile = aspect < 0.88;
      const portraitZoomMultiplier = pres
        ? aspect < 1.0
          ? Math.min(1.9, Math.pow(1 / aspect, 0.5) * 0.78)
          : 0.8 * Math.max(0.9, Math.pow(1.33 / aspect, 0.4))
        : aspect < 1.0
          ? Math.min(1.8, Math.pow(1 / aspect, 0.42) * 1.12)
          : 1.3 * Math.max(1, Math.pow(aspect / 1.6, 0.55));

      const activePreset =
        EXPLODED_SUBSYSTEMS[stg]?.cameraPreset ||
        EXPLODED_SUBSYSTEMS[0].cameraPreset;
      const basePos = new THREE.Vector3(...activePreset.position);
      const baseTarget = new THREE.Vector3(...activePreset.target);

      // On mobile portrait, shift the lookAt target downwards so the 3D boat sits comfortably in the upper half!
      if (pres) {
        baseTarget.y += 0.35;
      } else if (isPortraitMobile) {
        baseTarget.y += 2.2;
      } else {
        baseTarget.y += 2.7;
      }

      // Keep close-up presets from filling the frame: never tighter than ~86% of the overview distance
      const overviewPreset = EXPLODED_SUBSYSTEMS[0].cameraPreset;
      const overviewRadius =
        new THREE.Vector3(...overviewPreset.position).distanceTo(
          new THREE.Vector3(...overviewPreset.target)
        ) * portraitZoomMultiplier;
      const radius = Math.max(
        basePos.distanceTo(baseTarget) * portraitZoomMultiplier,
        overviewRadius * 0.86
      );
      const baseTheta = Math.atan2(
        basePos.x - baseTarget.x,
        basePos.z - baseTarget.z
      );
      const basePhi = Math.asin(
        (basePos.y - activePreset.target[1]) /
          basePos.distanceTo(new THREE.Vector3(...activePreset.target))
      );

      const finalTheta = baseTheta + userOrbitRef.current.theta;
      const finalPhi = Math.max(
        0.08,
        Math.min(1.2, basePhi + userOrbitRef.current.phi)
      );

      const desiredCamPos = new THREE.Vector3(
        baseTarget.x + radius * Math.cos(finalPhi) * Math.sin(finalTheta),
        baseTarget.y + radius * Math.sin(finalPhi),
        baseTarget.z + radius * Math.cos(finalPhi) * Math.cos(finalTheta)
      );

      currentCamPos.lerp(desiredCamPos, camDamp);
      currentCamTarget.lerp(baseTarget, camDamp);
      camera.position.copy(currentCamPos);
      camera.lookAt(currentCamTarget);

      // Material mode
      const isWireframe = viewModeRef.current === 'blueprint';
      const wireMat =
        themeRef.current === 'light' ? blueprintMatLight : blueprintMatDark;

      registeredMeshes.forEach(({ mesh, baseMat }) => {
        mesh.material = isWireframe ? wireMat : baseMat;
      });

      renderer.render(scene, camera);

      // Project hotspots
      if (now - lastHotspotSync > 48) {
        lastHotspotSync = now;
        const pinsOn = pres ? true : globalExplode > 0.15;
        const minSafeY = pres ? 44 : isPortraitMobile ? height * 0.55 : height * 0.5;
        const maxSafeY = pres ? height - 24 : height - (isPortraitMobile ? 150 : 80);
        const projected: ProjectedHotspot[] = hotspotAnchors.map((h) => {
          const world = h.localOffset.clone();
          h.group.localToWorld(world);

          // Occlusion: hide the marker when another system sits between it and the camera
          const toAnchor = world.clone().sub(camera.position);
          const anchorDist = toAnchor.length();
          occlusionRay.set(camera.position, toAnchor.normalize());
          const occluders = occluderCache.get(h.id) ?? [];
          const hit = occlusionRay.intersectObjects(occluders, false)[0];
          const occluded = !!hit && hit.distance < anchorDist - 0.12;

          const ndc = world.clone().project(camera);
          const x = (ndc.x * 0.5 + 0.5) * width;
          const y = (-(ndc.y * 0.5) + 0.5) * height;
          const visible =
            pinsOn &&
            !occluded &&
            ndc.z < 1.0 &&
            x > 24 &&
            x < width - 24 &&
            y > minSafeY &&
            y < maxSafeY;
          // Prefer the outer side; flip when the label would run off the panel
          const label = pinLabelsRef.current?.[h.id] ?? h.label;
          const labelW = label.length * 7.4 + 14;
          let side: 1 | -1 = x < width * 0.5 ? -1 : 1;
          if (side === 1 && x + 34 + labelW > width - 8) side = -1;
          if (side === -1 && x - 34 - labelW < 8) side = 1;
          return { id: h.id, label, x, y, lx: x, ly: y, side, visible };
        });

        // De-cluster: labels on the same side are pushed apart vertically
        const LEAD = 34;
        const MIN_GAP = 24;
        for (const side of [-1, 1] as const) {
          const col = projected
            .filter((p) => p.visible && p.side === side)
            .sort((a, b) => a.y - b.y);
          for (let i = 1; i < col.length; i++) {
            const prev = col[i - 1];
            const cur = col[i];
            if (cur.ly - prev.ly < MIN_GAP) cur.ly = prev.ly + MIN_GAP;
          }
          // keep inside the panel
          for (let i = col.length - 1; i >= 0; i--) {
            const cur = col[i];
            if (cur.ly > maxSafeY - 8) cur.ly = maxSafeY - 8;
            if (i < col.length - 1 && col[i + 1].ly - cur.ly < MIN_GAP) cur.ly = col[i + 1].ly - MIN_GAP;
          }
          col.forEach((p) => {
            p.lx = Math.max(12, Math.min(width - 12, p.x + side * LEAD));
          });
        }
        setHotspots(projected);
      }
    };

    animFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      const mobileNow =
        container.clientWidth < 768 || 'ontouchstart' in window;
      camera.fov = mobileNow ? 44 : 36;
      camera.aspect =
        container.clientWidth / Math.max(1, container.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameId);
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.dispose();
    };
  }, []);

  const effectiveExplodePercent = Math.round(
    (manualExplodeOverride !== null
      ? manualExplodeOverride
      : Math.max(0, Math.min(1, (scrollProgress - 0.04) / 0.85))) * 100
  );

  const isLight = theme === 'light';
  const sliderStyle = { '--pct': `${effectiveExplodePercent}%` } as React.CSSProperties;

  return (
    <div
      className="relative w-full h-full select-none overflow-hidden"
      style={{
        background: chromeless
          ? 'transparent'
          : isLight
          ? 'radial-gradient(90% 70% at 50% 55%, #ffffff 0%, #f5f5f7 60%, #ececee 100%)'
          : 'radial-gradient(90% 70% at 50% 55%, #1c1c1e 0%, #0a0a0b 60%, #000000 100%)',
      }}
    >
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Minimal callouts: dot on the part, hairline leader, small label. Hidden when occluded. */}
      {showPins && (
      <div className="pointer-events-none absolute inset-0 overflow-hidden hidden sm:block">
        <svg className="absolute inset-0 w-full h-full" aria-hidden>
          {hotspots.map((spot) => (
            <line
              key={spot.id}
              x1={spot.x}
              y1={spot.y}
              x2={spot.lx}
              y2={spot.ly}
              stroke={selectedSubsystemId === spot.id ? '#1b75bc' : 'rgba(9,44,88,0.45)'}
              strokeWidth={1}
              style={{ opacity: spot.visible ? 1 : 0, transition: 'opacity 260ms ease' }}
            />
          ))}
        </svg>
        {hotspots.map((spot) => {
          const isSelected = selectedSubsystemId === spot.id;
          return (
            <React.Fragment key={spot.id}>
              <span
                aria-hidden
                className={`absolute w-[9px] h-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] shadow-[0_1px_4px_rgba(0,0,0,0.25)] ${
                  isSelected ? 'bg-accent border-accent' : 'bg-white border-accent'
                }`}
                style={{
                  left: spot.x,
                  top: spot.y,
                  opacity: spot.visible ? 1 : 0,
                  transition: 'opacity 260ms ease',
                }}
              />
              <button
                type="button"
                tabIndex={spot.visible ? 0 : -1}
                onClick={() => onSelectSubsystem(spot.id)}
                className={`absolute -translate-y-1/2 whitespace-nowrap text-[10.5px] font-semibold uppercase tracking-[1.3px] leading-none py-1.5 px-1 transition-colors duration-200 ${
                  spot.side === 1 ? '' : '-translate-x-full'
                } ${isSelected ? 'text-accent' : 'text-navy hover:text-accent'} ${
                  spot.visible ? 'pointer-events-auto' : ''
                }`}
                style={{
                  left: spot.lx,
                  top: spot.ly,
                  opacity: spot.visible ? 1 : 0,
                  transition: 'opacity 260ms ease, color 200ms ease',
                  textShadow: '0 0 6px rgba(255,255,255,0.95), 0 0 2px rgba(255,255,255,0.95)',
                }}
              >
                {spot.label}
              </button>
            </React.Fragment>
          );
        })}
      </div>
      )}

      {/* Control pill */}
      {!chromeless && (
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[92px] sm:bottom-8 z-20 glass border border-line rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.12)] h-11 pl-4 pr-1.5 flex items-center gap-2.5 sm:gap-3 max-w-[calc(100vw-1.5rem)]">
        <span className="text-[12px] font-medium text-ink-2 whitespace-nowrap">Reveal</span>
        <input
          type="range"
          min={0}
          max={100}
          value={effectiveExplodePercent}
          onChange={(e) => setManualExplodeOverride(Number(e.target.value) / 100)}
          aria-label="Open the vessel"
          className="slider w-24 sm:w-40 cursor-pointer touch-manipulation"
          style={sliderStyle}
        />
        <span className="text-[12px] font-semibold tabular-nums w-9 text-right text-ink">
          {effectiveExplodePercent}%
        </span>

        {manualExplodeOverride !== null && (
          <button
            type="button"
            onClick={() => setManualExplodeOverride(null)}
            className="h-8 px-2.5 rounded-full text-[12px] font-medium text-accent hover:bg-accent/10 inline-flex items-center gap-1"
            title="Follow scroll again"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Follow scroll</span>
          </button>
        )}

        <div className="h-5 w-px bg-line" />

        <button
          type="button"
          onClick={() => setViewMode(viewMode === 'pbr' ? 'blueprint' : 'pbr')}
          className="h-8 px-2.5 rounded-full text-[12px] font-medium text-ink hover:bg-ink/[0.06] inline-flex items-center gap-1.5"
          title={viewMode === 'pbr' ? 'Show wireframe' : 'Show solid'}
        >
          {viewMode === 'pbr' ? (
            <>
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Wireframe</span>
            </>
          ) : (
            <>
              <Box className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Solid</span>
            </>
          )}
        </button>
      </div>
      )}
    </div>
  );
};
