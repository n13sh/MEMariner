export interface ExplodedSubsystem {
  id: string;
  code: string;
  name: string;
  arabicName: string;
  category: string;
  scrollRange: [number, number];
  stageIndex: number;
  summary: string;
  engineeringDetails: string;
  commonSpareParts: {
    partName: string;
    oemCategory: string;
    typicalApplication: string;
  }[];
  relatedServiceIds: string[];
  telemetryMetrics: {
    label: string;
    value: string;
    unit?: string;
  }[];
  colorAccent: string;
  cameraPreset: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export interface ServiceCategory {
  id: string;
  code: string;
  letter: string;
  title: string;
  subtitle: string;
  posterFeatured: boolean;
  description: string;
  services: string[];
  linkedSubsystemId: string;
  imageUrl: string;
  imageAlt: string;
}

export interface RunnerBoatModel {
  id: string;
  name: string;
  lengthFt: number;
  lengthMeters: string;
  tier: string;
  summary: string;
  idealUseCases: string[];
  verifiedSpecs: {
    modelName: string;
    lengthOverall: string;
    brandSeries: string;
    distributionRegion: string;
  };
  enquiryVerifyItems: string[];
  silhouetteScale: number;
  imageUrl: string;
}

export interface SurveyDomain {
  id: string;
  number: string;
  title: string;
  summary: string;
  checkpoints: string[];
}

export const COMPANY_INFO = {
  name: 'Middle East Mariner',
  tagline: 'SAFETY | RELIABILITY | EXCELLENCE',
  established: 2006,
  location: {
    street: 'Block 7, No. 1 Shop',
    city: 'East Ahmadi',
    country: 'Kuwait',
    fullAddress: 'East Ahmadi, Block 7, No. 1 Shop, Kuwait',
    serviceRegion: 'Kuwait & GCC (Gulf Cooperation Council)',
  },
  contact: {
    phoneDisplay: '+965 9913 8629',
    phoneHref: 'tel:+96599138629',
    whatsappNumber: '96599138629', // Flagged for client verification whether official WhatsApp is active on primary line
    email: 'info@middleeastmariner.com',
    emailHref: 'mailto:info@middleeastmariner.com',
    responsePromise: 'Enquiries answered within 24 hours on working days. For urgent matters please call.',
  },
  // Social profiles: leave a handle empty to hide its icon until confirmed
  social: {
    instagram: '',
    x: '',
    whatsapp: 'https://wa.me/96599138629',
  },
  hours: {
    days: 'Saturday to Thursday',
    time: '8:00 AM – 5:00 PM',
    closed: 'Friday (Emergency breakdown routing via telephone)',
    fullText: 'Saturday – Thursday, 8:00 AM – 5:00 PM (Kuwait Time, AST)',
  },
  posterStatement:
    'Middle East Mariner is your trusted partner in maritime solutions. We provide reliable, efficient, and compliant services tailored to meet the evolving needs of the maritime industry. Our commitment to safety, quality, and customer satisfaction sets us apart in every voyage we undertake.',
};

export const EXPLODED_SUBSYSTEMS: ExplodedSubsystem[] = [
  {
    id: 'assembled-overview',
    code: 'SYS-00',
    name: 'Complete Vessel Architecture',
    arabicName: 'الهيكل البحري المتكامل',
    category: 'Integrated Maritime Platform',
    scrollRange: [0.0, 0.13],
    stageIndex: 0,
    summary:
      'Scroll down to separate the vessel into 6 core engineering assemblies and inspect OEM spare parts, propulsion units, and structural systems.',
    engineeringDetails:
      'Middle East Mariner supports luxury yachts, commercial workboats, offshore crew vessels, and high-performance center-console cruisers across Kuwait and the GCC since 2006.',
    commonSpareParts: [
      {
        partName: 'Sacrificial Zinc & Aluminum Anode Kits',
        oemCategory: 'Hull & Corrosion Protection',
        typicalApplication: 'Hull stern, rudders, trim tabs & outboard brackets',
      },
      {
        partName: 'Marine-Grade 316 Stainless Deck Hardware',
        oemCategory: 'Deck & Mooring Fittings',
        typicalApplication: 'Cleats, fairleads, anchor windlass assemblies',
      },
      {
        partName: 'Complete Preventive Maintenance Service Kits',
        oemCategory: 'Scheduled Interval Kits',
        typicalApplication: '100-hour / 300-hour marine engine & generator kits',
      },
    ],
    relatedServiceIds: ['general-maintenance', 'boat-support'],
    telemetryMetrics: [
      { label: 'SUBSYSTEMS', value: '06', unit: 'MODULES' },
      { label: 'SERVICE COVERAGE', value: 'KUWAIT + GCC' },
      { label: 'EST.', value: '2006', unit: 'EAST AHMADI' },
    ],
    colorAccent: '#38BDF8',
    cameraPreset: {
      position: [10.5, 5.2, 11.5],
      target: [0, 0.4, 0],
    },
  },
  {
    id: 'radar-electronics',
    code: 'SYS-01',
    name: 'T-Top Superstructure, Radar & Marine Electronics',
    arabicName: 'أنظمة الملاحة والإلكترونيات البحرية',
    category: 'Navigation, Control & Electrical',
    scrollRange: [0.13, 0.28],
    stageIndex: 1,
    summary:
      'The upper canopy and helm console separate upward, exposing the solid-state radar dome, VHF antennas, digital helm bus, and marine electrical harnesses.',
    engineeringDetails:
      'Includes onboard electronics diagnostics, software programming and control systems, electrical fault repairs, NMEA 2000 network troubleshooting, and complete marine wiring upgrades.',
    commonSpareParts: [
      {
        partName: 'Marine Radar Dome & Transducer Assemblies',
        oemCategory: 'Navigation & Sonar',
        typicalApplication: 'Open-array & closed-dome radar, thru-hull transducers',
      },
      {
        partName: 'Digital Helm Control & Throttle Actuators',
        oemCategory: 'Electronic Shift & Throttle (EST)',
        typicalApplication: 'Fly-by-wire binnacle controls & gateway modules',
      },
      {
        partName: 'Tinned Copper Marine Wiring & Breakers',
        oemCategory: 'Electrical Distribution',
        typicalApplication: 'Ignition switches, waterproof fuse blocks, shore-power inlets',
      },
      {
        partName: 'AGM / Lithium Marine Battery Banks & Chargers',
        oemCategory: 'Power Storage & Alternators',
        typicalApplication: 'House & cranking battery isolation systems',
      },
    ],
    relatedServiceIds: ['mechanical-technical', 'general-maintenance'],
    telemetryMetrics: [
      { label: 'SYSTEM BUS', value: '12V / 24V / 230V' },
      { label: 'DIAGNOSTICS', value: 'NMEA & ECU' },
      { label: 'PROTECTION', value: 'IP67 / IP68' },
    ],
    colorAccent: '#0EA5E9',
    cameraPreset: {
      position: [7.8, 6.8, 8.2],
      target: [0.2, 2.1, 0],
    },
  },
  {
    id: 'twin-propulsion',
    code: 'SYS-02',
    name: 'Twin Marine Engines & Outboard Propulsion',
    arabicName: 'المحركات البحرية وأنظمة الدفع',
    category: 'Engine Servicing, Overhaul & OEM Parts',
    scrollRange: [0.28, 0.45],
    stageIndex: 2,
    summary:
      'Twin high-output marine engines slide aft along the thrust axis, revealing cylinder blocks, fuel injection rails, raw-water cooling loops, and counter-rotating stainless propellers.',
    engineeringDetails:
      'Full lifecycle engine care: computer diagnostics, oil & filter replacement, fuel system inspection, cooling system maintenance, complete engine overhauls, tuning, and outboard troubleshooting.',
    commonSpareParts: [
      {
        partName: 'OEM Oil Filters & Fuel/Water Separators',
        oemCategory: 'Filtration Systems',
        typicalApplication: 'Primary micron fuel separators & spin-on engine oil filters',
      },
      {
        partName: 'Raw-Water Neoprene Impellers & Housing Kits',
        oemCategory: 'Engine Cooling System',
        typicalApplication: 'Seawater pump overhaul, thermostats & heat exchanger gaskets',
      },
      {
        partName: 'Counter-Rotating Stainless Steel Propellers',
        oemCategory: 'Propulsion Hardware',
        typicalApplication: '3-blade & 4-blade stainless props, hub kits, thrust washers',
      },
      {
        partName: 'Fuel Injectors, Spark Plugs & High-Pressure Pumps',
        oemCategory: 'Fuel & Ignition',
        typicalApplication: 'Outboard & inboard petrol/diesel combustion components',
      },
    ],
    relatedServiceIds: ['engine-servicing', 'mechanical-technical'],
    telemetryMetrics: [
      { label: 'PROPULSION', value: 'INBOARD & OUTBOARD' },
      { label: 'SERVICE SCOPE', value: 'DIAGNOSTIC TO OVERHAUL' },
      { label: 'COOLING', value: 'RAW & CLOSED LOOP' },
    ],
    colorAccent: '#F59E0B',
    cameraPreset: {
      position: [-9.2, 3.4, 8.0],
      target: [-3.4, 0.5, 0],
    },
  },
  {
    id: 'steering-hydraulics',
    code: 'SYS-03',
    name: 'Hydraulic Steering, Trim Tabs & Propulsion Linkage',
    arabicName: 'أنظمة التوجيه الهيدروليكي والتوازن',
    category: 'Mechanical & Hydraulic Engineering',
    scrollRange: [0.45, 0.60],
    stageIndex: 3,
    summary:
      'Transom hydraulic steering cylinders, tie-bars, and heavy-duty trim planes expand outward to expose fluid actuators, high-pressure hoses, and stern mechanical linkages.',
    engineeringDetails:
      'Precision servicing for steering and hydraulic repairs, propulsion shaft alignment, trim tab actuator replacement, seal rebuilding, and emergency mechanical breakdown support.',
    commonSpareParts: [
      {
        partName: 'Hydraulic Steering Cylinders & Helm Pumps',
        oemCategory: 'Steering Actuation',
        typicalApplication: 'Single/twin engine transom rams, hydraulic gland seal kits',
      },
      {
        partName: 'Electro-Hydraulic Trim Tab Actuators',
        oemCategory: 'Vessel Attitude & Stability',
        typicalApplication: 'Stainless trim planes, hydraulic power units & helm switches',
      },
      {
        partName: 'Cutless Bearings, Shaft Seals & Tie-Bars',
        oemCategory: 'Drivetrain & Stern Gear',
        typicalApplication: 'Dripless shaft seals, stainless alignment tie-bars',
      },
    ],
    relatedServiceIds: ['mechanical-technical', 'boat-surveys'],
    telemetryMetrics: [
      { label: 'ACTUATION', value: 'HYDRAULIC / ELECTRO' },
      { label: 'INSPECTION', value: 'PRESSURE & SEAL TEST' },
      { label: 'HARDWARE', value: '316L STAINLESS' },
    ],
    colorAccent: '#10B981',
    cameraPreset: {
      position: [-8.0, 2.0, -7.8],
      target: [-3.0, -0.3, 0],
    },
  },
  {
    id: 'hvac-auxiliary',
    code: 'SYS-04',
    name: 'Marine Air Conditioning, Chiller & Fuel Core',
    arabicName: 'أنظمة التكييف البحري والوقود والمضخات',
    category: 'Climate Control, Plumbing & Auxiliary Systems',
    scrollRange: [0.60, 0.75],
    stageIndex: 4,
    summary:
      'With the cockpit sole lifted, the internal machinery bay reveals the marine reverse-cycle HVAC chiller unit, seawater circulation pumps, baffled fuel tanks, and bilge plumbing.',
    engineeringDetails:
      'Engineered for intense Arabian Gulf summer temperatures: marine air-conditioning installation, HVAC maintenance, climate-control upgrades, diagnostics, and full plumbing checks.',
    commonSpareParts: [
      {
        partName: 'Self-Contained & Chilled-Water Marine A/C Units',
        oemCategory: 'Marine Climate Control',
        typicalApplication: 'Cabin air handlers, cupronickel condensers & digital thermostats',
      },
      {
        partName: 'Magnetic-Drive Seawater A/C Circulation Pumps',
        oemCategory: 'HVAC Raw-Water Loop',
        typicalApplication: 'Continuous-duty centrifugal marine cooling pumps & strainers',
      },
      {
        partName: 'Automatic Bilge Pumps, Float Switches & Blowers',
        oemCategory: 'Plumbing & Safety Ventilation',
        typicalApplication: 'High-capacity submersibles, freshwater pressure pumps',
      },
    ],
    relatedServiceIds: ['marine-hvac', 'general-maintenance'],
    telemetryMetrics: [
      { label: 'GULF RATING', value: 'HIGH-AMBIENT HVAC' },
      { label: 'CONDENSER', value: 'CUPRONICKEL COIL' },
      { label: 'AUXILIARY', value: 'BILGE & FRESHWATER' },
    ],
    colorAccent: '#06B6D4',
    cameraPreset: {
      position: [5.5, 4.8, -8.5],
      target: [0.2, 0.1, 0],
    },
  },
  {
    id: 'hull-fabrication',
    code: 'SYS-05',
    name: 'Deep-V Hull Structure, Stringer Grid & Fabrication',
    arabicName: 'هيكل السفينة والألياف الزجاجية والتصنيع البحري',
    category: 'Marine Engineering, Fiberglass & Structural Surveys',
    scrollRange: [0.75, 0.90],
    stageIndex: 5,
    summary:
      'The outer Deep-V gelcoat hull separates from the internal longitudinal stringer and transverse bulkhead grid, illustrating structural load paths and survey inspection zones.',
    engineeringDetails:
      'Covers fiberglass repair and refinishing, marine carpentry, welding and fabrication, hull modifications, structural work, performance audits, and 5-point On-Board Boat Surveys.',
    commonSpareParts: [
      {
        partName: 'Marine Iso/NPG Gelcoat & Vinylester Resins',
        oemCategory: 'Composite & Fiberglass Repair',
        typicalApplication: 'Structural hull lamination, blister repair & color matching',
      },
      {
        partName: 'Bronze Thru-Hull Fittings & Seacock Valves',
        oemCategory: 'Below-Waterline Hardware',
        typicalApplication: 'Full-flow ball valves, raw-water intake scoops & strainers',
      },
      {
        partName: 'Heavy-Duty Rub Rails, Bow Rollers & Custom Fabrication',
        oemCategory: 'Structural & Deck Protection',
        typicalApplication: 'Stainless 316 brackets, radar arches, custom marine carpentry',
      },
    ],
    relatedServiceIds: ['marine-engineering', 'boat-surveys'],
    telemetryMetrics: [
      { label: 'COMPOSITES', value: 'GRP & GELCOAT' },
      { label: 'FABRICATION', value: 'WELDING & CARPENTRY' },
      { label: 'SURVEY SCOPE', value: '5-POINT INSPECTION' },
    ],
    colorAccent: '#6366F1',
    cameraPreset: {
      position: [8.8, 2.2, 9.2],
      target: [0.5, -0.6, 0],
    },
  },
  {
    id: 'interactive-inspector',
    code: 'SYS-06',
    name: 'Full Exploded OEM Spare Parts & Service Matrix',
    arabicName: 'الفحص التفاعلي الكامل لقطع الغيار والخدمات',
    category: 'Interactive 3D Requisition Mode',
    scrollRange: [0.90, 1.0],
    stageIndex: 6,
    summary:
      'Full radial separation active. Click any glowing component marker on the 3D vessel or use the manual Explosion Slider to inspect assemblies and request OEM spare parts.',
    engineeringDetails:
      'Submit your part numbers, OEM references, or engine serial details directly to our East Ahmadi technical desk for verification and sourcing across Kuwait and the GCC.',
    commonSpareParts: [
      {
        partName: 'Custom OEM Part Number / Serial Lookup',
        oemCategory: 'Direct Technical Sourcing',
        typicalApplication: 'Provide OEM reference or engine model for exact match verification',
      },
      {
        partName: 'Fleet & Commercial Maintenance Contracts',
        oemCategory: 'B2B & Yacht Support',
        typicalApplication: 'Scheduled dockside & on-site technical support across Kuwait',
      },
    ],
    relatedServiceIds: ['boat-support', 'engine-servicing', 'mechanical-technical'],
    telemetryMetrics: [
      { label: 'INTERACTION', value: '3D RAYCAST ACTIVE' },
      { label: 'DIRECT DESK', value: '+965 9913 8629' },
      { label: 'SOURCING', value: 'OEM & TECHNICAL' },
    ],
    colorAccent: '#38BDF8',
    cameraPreset: {
      position: [11.5, 6.4, 11.5],
      target: [0, 0.4, 0],
    },
  },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'general-maintenance',
    code: 'DIV-A',
    letter: 'A',
    title: 'General Vessel Maintenance',
    subtitle: 'Complete vessel care to maintain peak performance and preserve condition',
    posterFeatured: true,
    description:
      'Scheduled and routine care programs designed for private yachts, commercial boats, and fleet vessels operating in the high-salinity Arabian Gulf environment.',
    services: [
      'Preventive maintenance',
      'Hull and deck cleaning',
      'Electrical inspections',
      'Plumbing checks',
      'Marine equipment servicing',
      'Safety compliance checks',
    ],
    linkedSubsystemId: 'assembled-overview',
    imageUrl:
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Luxury motor yacht maintained in pristine condition on calm water',
  },
  {
    id: 'engine-servicing',
    code: 'DIV-B',
    letter: 'B',
    title: 'Engine Servicing & Repairs',
    subtitle: 'Professional marine engine servicing for maximum efficiency and reliability',
    posterFeatured: true,
    description:
      'Comprehensive diagnostics, scheduled oil and filtration changes, cooling system care, and complete mechanical overhauls for outboard and inboard marine engines.',
    services: [
      'Engine diagnostics',
      'Oil and filter replacement',
      'Fuel system inspections',
      'Cooling system maintenance',
      'Battery system checks',
      'Engine performance testing',
      'Engine overhaul',
      'Outboard engine diagnosis and repair',
      'Engine tuning',
      'Engine troubleshooting',
    ],
    linkedSubsystemId: 'twin-propulsion',
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'High-powered marine propulsion and offshore vessel underway',
  },
  {
    id: 'mechanical-technical',
    code: 'DIV-C',
    letter: 'C',
    title: 'Mechanical & Technical Repairs',
    subtitle: 'Reliable repair solutions for marine mechanical, electrical, and control systems',
    posterFeatured: true,
    description:
      'End-to-end fault isolation and repair across propulsion drivetrains, hydraulic steering systems, onboard electrical wiring, and modern marine electronics.',
    services: [
      'Mechanical troubleshooting',
      'Propulsion system repairs',
      'Steering and hydraulic repairs',
      'Electrical fault repairs',
      'Marine electronics servicing',
      'Emergency repair support',
      'Electrical wiring and system upgrades',
      'Software programming and control systems',
      'Onboard electronics diagnostics',
    ],
    linkedSubsystemId: 'steering-hydraulics',
    imageUrl:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Precision engineering diagnostics and electrical testing equipment',
  },
  {
    id: 'marine-engineering',
    code: 'DIV-D',
    letter: 'D',
    title: 'Marine Engineering & Fabrication',
    subtitle: 'Structural composites, custom metal fabrication, carpentry, and system optimization',
    posterFeatured: false,
    description:
      'Specialized structural and fabrication capabilities including fiberglass hull repair, marine carpentry, custom welding, hull modifications, and system performance audits.',
    services: [
      'Fiberglass repair and refinishing',
      'Marine carpentry',
      'Welding and fabrication',
      'Hull modifications',
      'Structural work',
      'System checks and fault isolation',
      'Performance audits and system optimization',
    ],
    linkedSubsystemId: 'hull-fabrication',
    imageUrl:
      'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Structural metal welding and precision marine fabrication work',
  },
  {
    id: 'marine-hvac',
    code: 'DIV-E',
    letter: 'E',
    title: 'Marine Air Conditioning & Climate Systems',
    subtitle: 'High-ambient cabin cooling installation, servicing, and diagnostics',
    posterFeatured: false,
    description:
      'Dedicated marine HVAC solutions engineered to maintain reliable onboard climate control in Kuwait and GCC maritime conditions.',
    services: [
      'Marine air-conditioning installation',
      'HVAC maintenance',
      'Climate-control upgrades',
      'Climate-control diagnostics',
    ],
    linkedSubsystemId: 'hvac-auxiliary',
    imageUrl:
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Climate control system gauges and technical HVAC manifolds',
  },
  {
    id: 'boat-support',
    code: 'DIV-F',
    letter: 'F',
    title: 'Boat Support Services',
    subtitle: 'Dedicated support services for yacht owners, shipowners, and marine operators',
    posterFeatured: true,
    description:
      'Flexible dockside and on-site technical assistance, spare parts sourcing, detailing preparation, custom maintenance contracts, and urgent breakdown support.',
    services: [
      'Dockside maintenance',
      'On-site technical support',
      'Yacht detailing and preparation',
      'Emergency marine assistance',
      'Spare parts sourcing',
      'Custom maintenance contracts',
    ],
    linkedSubsystemId: 'assembled-overview',
    imageUrl:
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Yacht moored at marina dock receiving technical preparation',
  },
  {
    id: 'additional-services',
    code: 'DIV-G',
    letter: 'G',
    title: 'Specialized & Additional Marine Services',
    subtitle: 'Jet ski servicing, condition surveys, seasonal storage, customization, and boat distribution',
    posterFeatured: false,
    description:
      'Extended lifecycle solutions covering personal watercraft (Jet Ski) servicing, comprehensive pre-purchase/on-board boat surveys, offseason storage protection, and Runner Boats distribution.',
    services: [
      'Jet ski servicing',
      'On-board boat surveys',
      'Offseason boat storage and protection',
      'Boat customization',
      'Boat distribution',
    ],
    linkedSubsystemId: 'radar-electronics',
    imageUrl:
      'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'High-speed marine craft operating across open blue sea',
  },
];

export const RUNNER_BOATS_MODELS: RunnerBoatModel[] = [
  {
    id: 'rider-25',
    name: 'Rider 25 FT',
    lengthFt: 25,
    lengthMeters: '7.62 m (Approx. Class Length)',
    tier: 'Compact Coastal & Day Cruiser Class',
    summary:
      'Agile 25-foot vessel profile suited for coastal cruising, nearshore sport utility, and versatile day operations across Kuwaiti waters.',
    idealUseCases: ['Coastal Day Cruising', 'Nearshore Utility', 'Private Owner Operation'],
    verifiedSpecs: {
      modelName: 'Runner Boats — Rider 25 FT',
      lengthOverall: '25 FT',
      brandSeries: 'Runner Boats Portfolio',
      distributionRegion: 'Kuwait & GCC via Middle East Mariner',
    },
    enquiryVerifyItems: [
      'Current build slot or stock availability',
      'Recommended outboard horsepower & twin/single rigging options',
      'Deck layout, seating & console electronics packages',
      'Official quotation & GCC delivery terms',
    ],
    silhouetteScale: 0.595,
    imageUrl:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'sirius-28',
    name: 'Sirius 28 FT',
    lengthFt: 28,
    lengthMeters: '8.53 m (Approx. Class Length)',
    tier: 'Mid-Size Offshore & Sport Class',
    summary:
      'Balanced 28-foot platform stepping up in deck footprint and offshore composure for extended coastal runs and family or commercial utility.',
    idealUseCases: ['Offshore Runs', 'Family & Guest Cruising', 'Harbor & Marina Transfer'],
    verifiedSpecs: {
      modelName: 'Runner Boats — Sirius 28 FT',
      lengthOverall: '28 FT',
      brandSeries: 'Runner Boats Portfolio',
      distributionRegion: 'Kuwait & GCC via Middle East Mariner',
    },
    enquiryVerifyItems: [
      'Current build slot or stock availability',
      'Engine configuration & fuel tank capacity specifications',
      'Canopy / T-Top and cabin/console fit-out options',
      'Official quotation & GCC delivery terms',
    ],
    silhouetteScale: 0.666,
    imageUrl:
      'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'crown-33',
    name: 'Crown 33 FT',
    lengthFt: 33,
    lengthMeters: '10.06 m (Approx. Class Length)',
    tier: '33-Foot Offshore Cruiser Class',
    summary:
      'Commanding 33-foot vessel engineered for longer-range Gulf passages, offering increased deck volume and customizable equipment configurations.',
    idealUseCases: ['Extended Gulf Passages', 'VIP Day Charter / Leisure', 'Offshore Support'],
    verifiedSpecs: {
      modelName: 'Runner Boats — Crown 33 FT',
      lengthOverall: '33 FT',
      brandSeries: 'Runner Boats Portfolio',
      distributionRegion: 'Kuwait & GCC via Middle East Mariner',
    },
    enquiryVerifyItems: [
      'Current build slot or stock availability',
      'Twin propulsion rigging & electronics suite options',
      'Cabin / head compartment & climate-control specifications',
      'Official quotation & GCC delivery terms',
    ],
    silhouetteScale: 0.785,
    imageUrl:
      'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'deluxe-36',
    name: 'Deluxe 36 FT',
    lengthFt: 36,
    lengthMeters: '10.97 m (Approx. Class Length)',
    tier: '36-Foot Premium Touring Class',
    summary:
      'Refined 36-foot model combining generous beam proportions with luxury leisure and offshore capability.',
    idealUseCases: ['Luxury Leisure Cruising', 'Island Hopping', 'Custom Fit-Out Builds'],
    verifiedSpecs: {
      modelName: 'Runner Boats — Deluxe 36 FT',
      lengthOverall: '36 FT',
      brandSeries: 'Runner Boats Portfolio',
      distributionRegion: 'Kuwait & GCC via Middle East Mariner',
    },
    enquiryVerifyItems: [
      'Current build slot or stock availability',
      'Full hull specifications (beam, draft, displacement)',
      'Marine A/C, generator, and luxury upholstery options',
      'Official quotation & GCC delivery terms',
    ],
    silhouetteScale: 0.857,
    imageUrl:
      'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'trident-38',
    name: 'Trident 38 FT',
    lengthFt: 38,
    lengthMeters: '11.58 m (Approx. Class Length)',
    tier: '38-Foot High-Performance Offshore Class',
    summary:
      'High-capability 38-foot offshore platform designed for demanding open-water performance, multi-engine propulsion, and serious maritime operators.',
    idealUseCases: ['Open-Water Performance', 'Multi-Engine Offshore Operations', 'Executive Transport'],
    verifiedSpecs: {
      modelName: 'Runner Boats — Trident 38 FT',
      lengthOverall: '38 FT',
      brandSeries: 'Runner Boats Portfolio',
      distributionRegion: 'Kuwait & GCC via Middle East Mariner',
    },
    enquiryVerifyItems: [
      'Current build slot or stock availability',
      'Multi-outboard or inboard engine configuration ratings',
      'Navigation radar, sonar & helm integration options',
      'Official quotation & GCC delivery terms',
    ],
    silhouetteScale: 0.905,
    imageUrl:
      'https://images.unsplash.com/photo-1520637836862-4d197d17c90a?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'magnus-42',
    name: 'Magnus 42 FT',
    lengthFt: 42,
    lengthMeters: '12.80 m (Approx. Class Length)',
    tier: '42-Foot Flagship Cruiser Class',
    summary:
      'The 42-foot flagship of the Runner Boats portfolio offered through Middle East Mariner, delivering maximum deck presence and bespoke custom configuration potential.',
    idealUseCases: ['Flagship Yacht Ownership', 'Long-Range GCC Cruising', 'Bespoke Customization'],
    verifiedSpecs: {
      modelName: 'Runner Boats — Magnus 42 FT',
      lengthOverall: '42 FT',
      brandSeries: 'Runner Boats Portfolio',
      distributionRegion: 'Kuwait & GCC via Middle East Mariner',
    },
    enquiryVerifyItems: [
      'Current build slot or stock availability',
      'Flagship propulsion, generator & marine HVAC packages',
      'Interior cabin layout, carpentry & custom finishes',
      'Official quotation & GCC delivery terms',
    ],
    silhouetteScale: 1.0,
    imageUrl:
      'https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=900&q=80',
  },
];

export const SURVEY_DOMAINS: SurveyDomain[] = [
  {
    id: 'survey-engines',
    number: '01',
    title: 'Engines & Propulsion Systems',
    summary:
      'Mechanical and diagnostic evaluation of main propulsion engines, generators, fuel delivery, cooling loops, and exhaust integrity.',
    checkpoints: [
      'Computer ECU fault history & operating hours review (where supported)',
      'Visual inspection of fuel lines, filters, clamps, and raw-water cooling pumps',
      'Battery bank load check, charging voltage, and starter circuit inspection',
      'Propeller blades, shaft seals, mounts, and hydraulic trim/steering checks',
    ],
  },
  {
    id: 'survey-hull',
    number: '02',
    title: 'Hull & Structural Integrity',
    summary:
      'Inspection of outer fiberglass gelcoat, topsides, transom core, structural stringers, bulkheads, and below-waterline fittings.',
    checkpoints: [
      'Hull surface check for stress crazing, impact damage, delamination, or osmosis blisters',
      'Transom, stringer grid, and bulkhead visual structural assessment',
      'Thru-hull fittings, seacocks, anodes, and rudder/stern gear condition',
      'Deck hardware bedding, hatches, rub-rails, and structural joints',
    ],
  },
  {
    id: 'survey-stability',
    number: '03',
    title: 'Vessel Trim, Attitude & Stability Systems',
    summary:
      'Assessment of trim control systems, bilge water management, tankage arrangement, and waterline balance.',
    checkpoints: [
      'Trim tab actuators, helm indicators, and hydraulic line inspection',
      'Bilge pump operation, automatic float switches, and high-water alarms',
      'Fuel and freshwater tank mounting security and ventilation checks',
      'Visual static waterline attitude and list observation',
    ],
  },
  {
    id: 'survey-electronics',
    number: '04',
    title: 'Navigation & Onboard Electronics',
    summary:
      'Functional testing of helm instrumentation, radar, sonar, VHF communication, lighting, and AC/DC electrical panels.',
    checkpoints: [
      'MFD chartplotters, radar dome operation, GPS fix, and depth transducers',
      'VHF marine radio power-on test and antenna mounting inspection',
      'DC breaker panels, shore-power inlets, battery switches, and wiring harness condition',
      'Navigation lights, anchor lights, horn, and cabin/cockpit electrical circuits',
    ],
  },
  {
    id: 'survey-safety',
    number: '05',
    title: 'Onboard Safety & Emergency Equipment',
    summary:
      'Audit of essential maritime safety gear, fire suppression readiness, anchoring tackle, and emergency readiness.',
    checkpoints: [
      'Portable fire extinguishers and engine-room fire port visual inspection',
      'Personal flotation devices (PFDs), life rings, and distress signaling inventory check',
      'Anchor windlass operation, chain/rode condition, and bow roller security',
      'Emergency manual bilge pump and carbon monoxide / smoke detector checks',
    ],
  },
];

export const SPARE_PARTS_CATEGORIES = [
  {
    id: 'engine-filtration',
    title: 'Engine Filtration & Maintenance Kits',
    examples: 'OEM Oil Filters, Fuel/Water Separators, Air Filters, Anodes, Spark Plugs, Belts',
    subsystemId: 'twin-propulsion',
  },
  {
    id: 'cooling-pumps',
    title: 'Cooling Systems & Impellers',
    examples: 'Neoprene Impellers, Raw-Water Pumps, Thermostats, Heat Exchanger Gaskets, Hoses',
    subsystemId: 'twin-propulsion',
  },
  {
    id: 'propulsion-drivetrain',
    title: 'Propellers, Shafts & Stern Gear',
    examples: 'Stainless Propellers, Hub Kits, Cutless Bearings, Shaft Seals, Trim Tab Actuators',
    subsystemId: 'steering-hydraulics',
  },
  {
    id: 'steering-hydraulic-parts',
    title: 'Hydraulic Steering & Controls',
    examples: 'Steering Cylinders, Helm Pumps, Hydraulic Seal Kits, Electronic Throttle Controls',
    subsystemId: 'steering-hydraulics',
  },
  {
    id: 'electrical-navigation',
    title: 'Marine Electrical & Electronics',
    examples: 'Alternators, Starters, Marine Batteries, Breakers, Sensors, Radar & Sonar Spares',
    subsystemId: 'radar-electronics',
  },
  {
    id: 'hvac-plumbing',
    title: 'Marine HVAC & Bilge Plumbing',
    examples: 'Self-Contained Marine A/C Units, Seawater Circulation Pumps, Bilge Pumps, Seacocks',
    subsystemId: 'hvac-auxiliary',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'How do I order marine spare parts or verify compatibility with my engine?',
    answer:
      'Use our OEM Spare Parts Requisition form or click any component on the 3D Exploded Vessel to select your subsystem. Provide your engine make, model, serial number, or OEM part reference. Our technical team in East Ahmadi verifies exact compatibility and current availability before issuing a formal quotation.',
  },
  {
    question: 'Do you provide mobile dockside maintenance or must the boat be brought to East Ahmadi?',
    answer:
      'Middle East Mariner provides both workshop engineering from our East Ahmadi facility and dockside maintenance / on-site technical support across marinas in Kuwait. Service availability depends on the vessel location and the nature of the mechanical or structural work required.',
  },
  {
    question: 'What information do you need for an urgent marine breakdown?',
    answer:
      'For urgent breakdowns, please call +965 9913 8629 directly. Be ready to share your current marina or coastal coordinates, vessel type, engine make/model, and nature of the fault (e.g., loss of propulsion, overheating, electrical failure, or steering loss).',
  },
  {
    question: 'Are the Runner Boats models (25 FT to 42 FT) customizable?',
    answer:
      'Yes. The Runner Boats portfolio (Rider 25 FT, Sirius 28 FT, Crown 33 FT, Deluxe 36 FT, Trident 38 FT, and Magnus 42 FT) can be configured based on customer requirements. Because specifications, engine rigging, pricing, and delivery timelines depend on build configuration and current availability, all boat enquiries are handled directly by our sales and engineering desk.',
  },
  {
    question: 'What is included in an On-Board Boat Survey?',
    answer:
      'Our On-Board Boat Survey inspects five key areas: Engines, Hull, Stability systems, Electronics, and Safety equipment, followed by a structured inspection report. Please note that a survey documents observed condition at the time of inspection and does not constitute a warranty or guarantee of seaworthiness.',
  },
];
