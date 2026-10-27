import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EXPLODED_SUBSYSTEMS } from '../data/marinerData';
import { Layers, Sparkles, RotateCcw, Crosshair } from 'lucide-react';

export type RenderViewMode = 'pbr' | 'blueprint';

interface ProjectedHotspot {
  id: string;
  label: string;
  x: number;
  y: number;
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
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [hotspots, setHotspots] = useState<ProjectedHotspot[]>([]);

  const scrollRef = useRef(scrollProgress);
  const stageRef = useRef(activeStageIndex);
  const overrideRef = useRef(manualExplodeOverride);
  const viewModeRef = useRef<RenderViewMode>(viewMode);
  const themeRef = useRef<'light' | 'dark'>(theme);
  const isVisibleRef = useRef(true);

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
      Math.min(window.devicePixelRatio, isMobileScreen ? 1.5 : 2)
    );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = !isMobileScreen; // Disable heavy real-time shadows on mobile for locked 60fps
    if (!isMobileScreen) {
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // CRITICAL: Ensure touch events pass through vertically for natural mobile page scrolling
    renderer.domElement.style.touchAction = 'pan-y';

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
    keyLight.position.set(12, 18, 14);
    if (!isMobileScreen) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 2048;
      keyLight.shadow.mapSize.height = 2048;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
    rimLight.position.set(-14, 8, -10);
    scene.add(rimLight);

    const underHullGlow = new THREE.PointLight(0x1b75bc, 1.8, 18);
    underHullGlow.position.set(0, -2.5, 0);
    scene.add(underHullGlow);

    // Subtle platform ring
    const gridGroup = new THREE.Group();
    const polarGrid = new THREE.PolarGridHelper(
      13,
      12,
      6,
      64,
      0x1b75bc,
      0x64748b
    );
    polarGrid.position.y = -2.35;
    (polarGrid.material as THREE.Material).transparent = true;
    (polarGrid.material as THREE.Material).opacity = 0.22;
    gridGroup.add(polarGrid);
    scene.add(gridGroup);

    // Materials
    const materials = {
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
        color: 0xc28b59,
        metalness: 0.05,
        roughness: 0.6,
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

    // 1. HULL & STRINGERS
    const outerHullGroup = new THREE.Group();
    const stringerGridGroup = new THREE.Group();
    vesselRoot.add(outerHullGroup);
    vesselRoot.add(stringerGridGroup);

    const buildHullGeometry = () => {
      const stations = 24;
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
        new THREE.Mesh(buildHullGeometry(), materials.navyHull),
        materials.navyHull,
        'hull-fabrication'
      )
    );

    const transomMesh = registerMesh(
      new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 1.15, 3.05),
        materials.navyHull
      ),
      materials.navyHull,
      'hull-fabrication'
    );
    transomMesh.position.set(-3.55, -0.32, 0);
    outerHullGroup.add(transomMesh);

    [-0.95, -0.35, 0.35, 0.95].forEach((zPos) => {
      const len = Math.abs(zPos) < 0.5 ? 6.6 : 5.4;
      const sMesh = registerMesh(
        new THREE.Mesh(
          new THREE.BoxGeometry(len, 0.34, 0.08),
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
          new THREE.BoxGeometry(0.08, 0.38, width),
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
          new THREE.BoxGeometry(2.35, 0.38, 0.48),
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
        new THREE.BoxGeometry(1.15, 0.52, 0.72),
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
    const mainDeckGroup = new THREE.Group();
    vesselRoot.add(mainDeckGroup);

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
        new THREE.BoxGeometry(1.95, 0.24, 1.55),
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
          new THREE.BoxGeometry(0.52, 0.58, 0.52),
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
        new THREE.BoxGeometry(0.58, 0.46, 2.35),
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
        new THREE.BoxGeometry(1.35, 1.05, 1.25),
        materials.arcticWhiteGelcoat
      ),
      materials.arcticWhiteGelcoat,
      'radar-electronics'
    );
    consoleBase.position.set(0.15, 0.82, 0);
    radarElectronicsGroup.add(consoleBase);

    const mfdScreen = registerMesh(
      new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.36, 0.96),
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
        new THREE.BoxGeometry(0.85, 0.55, 1.18),
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
        new THREE.BoxGeometry(2.65, 0.11, 1.85),
        materials.navyHull
      ),
      materials.navyHull,
      'radar-electronics'
    );
    hardtop.position.set(-0.05, 2.38, 0);
    radarElectronicsGroup.add(hardtop);

    const radarScannerBar = registerMesh(
      new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.12, 1.18),
        materials.radarElectronicsGlow
      ),
      materials.radarElectronicsGlow,
      'radar-electronics'
    );
    radarScannerBar.position.set(0.15, 2.6, 0);
    radarElectronicsGroup.add(radarScannerBar);

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
          new THREE.BoxGeometry(0.68, 0.64, 0.44),
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
          new THREE.BoxGeometry(0.82, 0.78, 0.54),
          materials.engineCowlingMetallic
        ),
        materials.engineCowlingMetallic,
        'twin-propulsion'
      );
      cowling.position.set(-3.88, 0.65, zOffset);
      upperCowlingsSubGroup.add(cowling);

      const midLeg = registerMesh(
        new THREE.Mesh(
          new THREE.BoxGeometry(0.36, 0.92, 0.24),
          materials.engineCowlingMetallic
        ),
        materials.engineCowlingMetallic,
        'twin-propulsion'
      );
      midLeg.position.set(-0.06, -0.18, 0);
      engineUnit.add(midLeg);

      const torpedo = registerMesh(
        new THREE.Mesh(
          new THREE.CylinderGeometry(0.13, 0.08, 0.72, 14),
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
            new THREE.BoxGeometry(0.03, 0.24, 0.11),
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
          new THREE.BoxGeometry(0.45, 0.03, 0.42),
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
        localOffset: new THREE.Vector3(0.95, 0.25, 0),
      },
      {
        id: 'hull-fabrication',
        label: 'Hull & Stringers',
        group: stringerGridGroup,
        localOffset: new THREE.Vector3(1.8, -0.62, 0.95),
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

    const handlePointerUp = () => {
      userOrbitRef.current.isDragging = false;
      userOrbitRef.current.isHorizontalOrbit = false;
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

      const targetProgress =
        overrideRef.current !== null
          ? overrideRef.current
          : scrollRef.current;
      smoothScroll += (targetProgress - smoothScroll) * 0.09;

      const globalExplode = Math.max(
        0,
        Math.min(1, (smoothScroll - 0.04) / 0.85)
      );
      const stg = stageRef.current;

      // Part separation
      radarElectronicsGroup.position.y = THREE.MathUtils.lerp(
        0,
        2.3 * globalExplode * (stg === 1 ? 1.3 : 1),
        0.15
      );
      radarScannerBar.rotation.y = now * 0.002;

      mainDeckGroup.position.y = THREE.MathUtils.lerp(
        0,
        1.0 * globalExplode,
        0.15
      );
      hvacAndAuxGroup.position.y = THREE.MathUtils.lerp(
        0,
        0.4 * globalExplode * (stg === 4 ? 1.35 : 1),
        0.15
      );

      twinEnginesGroup.position.x = THREE.MathUtils.lerp(
        0,
        -1.9 * globalExplode * (stg === 2 ? 1.35 : 1),
        0.15
      );
      upperCowlingsSubGroup.position.y = THREE.MathUtils.lerp(
        0,
        0.9 * globalExplode,
        0.15
      );

      propellersList.forEach((prop, idx) => {
        prop.rotation.x = now * 0.008 * (idx === 0 ? 1 : -1);
      });

      steeringHydraulicsGroup.position.x = THREE.MathUtils.lerp(
        0,
        -1.0 * globalExplode * (stg === 3 ? 1.35 : 1),
        0.15
      );
      steeringHydraulicsGroup.position.y = THREE.MathUtils.lerp(
        0,
        -0.35 * globalExplode,
        0.15
      );

      stringerGridGroup.position.y = THREE.MathUtils.lerp(
        0,
        -0.3 * globalExplode,
        0.15
      );
      outerHullGroup.position.y = THREE.MathUtils.lerp(
        0,
        -1.3 * globalExplode,
        0.15
      );

      vesselRoot.position.y = Math.sin(now * 0.0015) * 0.05;

      // Mobile Portrait Viewport & Camera Placement
      const width = container.clientWidth;
      const height = container.clientHeight;
      const aspect = width / Math.max(1, height);
      const isPortraitMobile = aspect < 0.88;
      const portraitZoomMultiplier =
        aspect < 1.0 ? Math.min(1.58, Math.pow(1 / aspect, 0.42)) : 1.0;

      const activePreset =
        EXPLODED_SUBSYSTEMS[stg]?.cameraPreset ||
        EXPLODED_SUBSYSTEMS[0].cameraPreset;
      const basePos = new THREE.Vector3(...activePreset.position);
      const baseTarget = new THREE.Vector3(...activePreset.target);

      // On mobile portrait, shift the lookAt target downwards so the 3D boat sits comfortably in the upper half!
      if (isPortraitMobile) {
        baseTarget.y -= 1.15;
      }

      const radius = basePos.distanceTo(baseTarget) * portraitZoomMultiplier;
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

      currentCamPos.lerp(desiredCamPos, 0.07);
      currentCamTarget.lerp(baseTarget, 0.07);
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
        const showPins = globalExplode > 0.15;
        const maxSafeY = isPortraitMobile ? height * 0.48 : height - 60;
        const projected: ProjectedHotspot[] = hotspotAnchors.map((h) => {
          const worldPos = h.localOffset.clone();
          h.group.localToWorld(worldPos);
          worldPos.project(camera);
          const x = (worldPos.x * 0.5 + 0.5) * width;
          const y = (-(worldPos.y * 0.5) + 0.5) * height;
          const visible =
            showPins &&
            worldPos.z < 1.0 &&
            x > 32 &&
            x < width - 32 &&
            y > (isPortraitMobile ? 55 : 40) &&
            y < maxSafeY;
          return { id: h.id, label: h.label, x, y, visible };
        });
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

  // Quick exploded presets for one-tap mobile control
  const setQuickPreset = (pct: number) => {
    setManualExplodeOverride(pct / 100);
  };

  return (
    <div
      className={`relative w-full h-full select-none overflow-hidden transition-colors duration-500 ${
        isLight
          ? 'bg-gradient-to-b from-[#EBF3FA] via-[#F4F8FC] to-[#E2EEF8]'
          : 'bg-gradient-to-b from-[#040d1a] via-[#071936] to-[#040d1a]'
      }`}
    >
      {/* Three.js Canvas */}
      <div
        ref={mountRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Interactive 3D Callout Hotspots (Tapping selects the part) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {hotspots.map((spot) => {
          if (!spot.visible) return null;
          const isSelected = selectedSubsystemId === spot.id;
          return (
            <button
              key={spot.id}
              type="button"
              onClick={() => onSelectSubsystem(spot.id)}
              style={{
                transform: `translate3d(${spot.x}px, ${spot.y}px, 0)`,
              }}
              className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 sm:gap-2 rounded-full px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-semibold transition-all shadow-lg active:scale-95 ${
                isSelected
                  ? 'bg-[#1B75BC] text-white scale-105 ring-2 ring-sky-300'
                  : isLight
                  ? 'bg-white/95 text-[#092C58] border border-slate-200 hover:bg-[#092C58] hover:text-white'
                  : 'bg-[#092C58]/95 text-white border border-sky-400/40 hover:bg-[#1B75BC]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0 animate-pulse" />
              <span className="whitespace-nowrap">{spot.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          RESPONSIVE 3D CONTROL BAR
          - On mobile: placed at top-3 (below header) with 44px touch targets & quick preset chips
          - On desktop: placed at bottom-6
      ===================================================================== */}
      <div
        className={`
          absolute top-3 left-1/2 -translate-x-1/2 sm:top-auto sm:bottom-6
          z-20 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 rounded-2xl sm:rounded-full
          px-3.5 py-2 backdrop-blur-xl border shadow-xl transition-colors max-w-[95vw]
          ${
            isLight
              ? 'bg-white/95 border-slate-200/90 text-[#092C58]'
              : 'bg-[#061326]/95 border-white/20 text-white'
          }
        `}
      >
        {/* Main Row: Label, Slider, Reset, Mode Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5 shrink-0">
            <Crosshair className="w-3.5 h-3.5 text-[#1B75BC]" />
            <span className="text-xs font-bold whitespace-nowrap">
              Reveal:{' '}
              <strong className="text-[#1B75BC]">
                {effectiveExplodePercent}%
              </strong>
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={effectiveExplodePercent}
            onChange={(e) =>
              setManualExplodeOverride(Number(e.target.value) / 100)
            }
            aria-label="Open Boat Parts Slider"
            className="w-28 sm:w-36 accent-[#1B75BC] cursor-pointer h-2 rounded-lg touch-manipulation"
          />

          {manualExplodeOverride !== null && (
            <button
              type="button"
              onClick={() => setManualExplodeOverride(null)}
              className="inline-flex items-center gap-1 min-h-[36px] px-2 rounded-lg text-xs font-bold text-[#1B75BC] hover:bg-sky-500/10 active:scale-95"
              title="Sync back to scroll"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Scroll</span>
            </button>
          )}

          <div className="h-4 w-px bg-current opacity-20 hidden sm:block" />

          <button
            type="button"
            onClick={() =>
              setViewMode(viewMode === 'pbr' ? 'blueprint' : 'pbr')
            }
            className="inline-flex items-center gap-1.5 min-h-[36px] px-2.5 rounded-lg text-xs font-bold hover:text-[#1B75BC] transition shrink-0 active:scale-95"
          >
            {viewMode === 'pbr' ? (
              <>
                <Layers className="w-3.5 h-3.5 text-[#1B75BC]" />
                <span className="hidden xs:inline">Wireframe</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">3D Solid</span>
              </>
            )}
          </button>
        </div>

        {/* Mobile Quick-Preset Chips: Allows instant one-tap inspection of any subsystem */}
        <div className="flex sm:hidden items-center gap-1 w-full pt-1 border-t border-current/10 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold tracking-wider opacity-60 shrink-0 mr-1">
            Quick:
          </span>
          {[
            { label: 'Closed', pct: 0 },
            { label: 'Radar', pct: 22 },
            { label: 'Engines', pct: 45 },
            { label: 'Hydraulics', pct: 60 },
            { label: 'Full Open', pct: 100 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setQuickPreset(preset.pct)}
              className={`shrink-0 min-h-[30px] px-2 py-0.5 rounded-full text-[10px] font-bold transition active:scale-95 ${
                Math.abs(effectiveExplodePercent - preset.pct) < 10
                  ? 'bg-[#1B75BC] text-white'
                  : 'bg-black/5 dark:bg-white/10 opacity-75'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
