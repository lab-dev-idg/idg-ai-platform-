import { ImporterProductInput, CustomsScenario, RouteTimelineNode } from './types';

export const MOCK_SCENARIOS: Record<string, ImporterProductInput> = {
  laptops: {
    productName: 'ThinBook Pro High-Perf Laptop Computers',
    productDescription: 'Portable computers containing Intel Core i7 CPUs, 16GB LPDDR5 RAM, 512GB NVMe SSD with integrated lithium-ion batteries. Approved for educational and corporate deployments in Erbil Governorate.',
    quantity: 500,
    originCountry: 'China',
    invoiceValue: 250000,
    destinationCity: 'Erbil',
    transportMethod: 'Sea Freight'
  },
  medical: {
    productName: 'Advanced MRI & Cardiac ICU Scanners',
    productDescription: 'High-precision magnetic resonance imaging scanners, healthcare telemetry accessories, and medical workstation consoles for Iraqi federal clinics in Baghdad.',
    quantity: 12,
    originCountry: 'Germany',
    invoiceValue: 780000,
    destinationCity: 'Baghdad',
    transportMethod: 'Air Freight'
  },
  construction: {
    productName: 'Heavy Structural Steel Rebar Bundles',
    productDescription: 'Grade 60 carbon steel reinforcing bars for regional infrastructure construction projects in Northern Iraq, certified for maximum seismic load capacity.',
    quantity: 180,
    originCountry: 'Turkey',
    invoiceValue: 145000,
    destinationCity: 'Erbil',
    transportMethod: 'Land Freight'
  },
  agricultural: {
    productName: 'Temperature-Controlled Grains & Agri Seeds',
    productDescription: 'Pre-treated hybrid cereal seeds and high-yield grain cultivars designed for semi-arid zones. National grain replenishment program for Nineveh Governorate.',
    quantity: 450,
    originCountry: 'Jordan',
    invoiceValue: 95000,
    destinationCity: 'Mosul',
    transportMethod: 'Land Freight'
  },
  telecom: {
    productName: '5G Fiber-Optic Cellular Transceivers',
    productDescription: 'MIMO multi-band telecommunications transmitters, active antenna processors, and gigabit optical fiber cables for cellular node expansions across Baghdad City.',
    quantity: 85,
    originCountry: 'South Korea',
    invoiceValue: 620000,
    destinationCity: 'Baghdad',
    transportMethod: 'Air Freight'
  }
};

/**
 * Dynamic brain that takes current user input and returns a fully filled CustomsScenario.
 * This ensures the application works completely offline as a fully functioning sandbox.
 */
export function calculateScenario(input: ImporterProductInput): CustomsScenario {
  const normName = input.productName.toLowerCase();
  const normDesc = input.productDescription.toLowerCase();

  // 1. Determine Product characteristics and HS Classification based on keywords
  let hsSuggestedCode = '8471.30'; // laptop default
  let confidenceScore = 96;
  let alternativeCodes = [
    { code: '8471.41', confidence: 91, label: 'Digital automatic data processing machines stored-program units' },
    { code: '8471.49', confidence: 84, label: 'Other digital automatic processing systems entered as system' }
  ];
  let productCategory = 'Automatic Data Processing Machines & Thin Clients';
  let customsClassification = 'Category IV High-Tech Equipment';
  let dutyPercent = 5;
  let taxPercent = 10;
  let processingFee = 250;
  let regulatoryNotes = 'Requires CMC (Communications and Media Commission) Type-Approval Certification under Iraqi telecom safety standards. Eligible for Green-Lane expedited customs clearance upon digital submission of battery security sheets.';
  let typeApprovalRequired = true;
  let greenLaneEligible = true;
  let riskScore = 15;

  if (normName.includes('vaccine') || normName.includes('medic') || normName.includes('pharm') || normDesc.includes('medical') || normName.includes('mri')) {
    hsSuggestedCode = '9018.13'; // medical scanners
    confidenceScore = 98;
    alternativeCodes = [
      { code: '9018.19', confidence: 89, label: 'Other electro-diagnostic apparatus (including apparatus for functional exploratory examination)' },
      { code: '9018.90', confidence: 82, label: 'Instruments and appliances used in medical or veterinary sciences' }
    ];
    productCategory = 'Electro-Diagnostic Medical Instruments (MRI)';
    customsClassification = 'Category I Vital Humanitarian Goods';
    dutyPercent = 2; // Encouraged humanitarian tariff
    taxPercent = 5; // Reduced health sector VAT
    processingFee = 150;
    regulatoryNotes = 'Requires Ministry of Health (KIMADIA) import permit endorsement and cool-chain log validation. Exempt from standard customs duty queues. Express VIP clearance authorized.';
    typeApprovalRequired = true;
    greenLaneEligible = true;
    riskScore = 8;
  } else if (normName.includes('steel') || normName.includes('rebar') || normName.includes('construct') || normDesc.includes('iron')) {
    hsSuggestedCode = '7214.20';
    confidenceScore = 94;
    alternativeCodes = [
      { code: '7213.91', confidence: 89, label: 'Bars and rods, hot-rolled, in irregularly wound coils' },
      { code: '7308.90', confidence: 78, label: 'Structures and parts of structures of iron or steel' }
    ];
    productCategory = 'Structural Iron & Non-alloy Steel';
    customsClassification = 'Category III Heavy Infrastructure Materials';
    dutyPercent = 12; // Protectionist rate for local industries
    taxPercent = 10;
    processingFee = 500; // higher heavy materials check
    regulatoryNotes = 'Subject to Central Organization for Standardization and Quality Control (COSQC) hardness testing. Grade certification must be physically cross-referenced with Iraqi build codes.';
    typeApprovalRequired = false;
    greenLaneEligible = false;
    riskScore = 28;
  } else if (normName.includes('grain') || normName.includes('agri') || normName.includes('seed') || normName.includes('cereal')) {
    hsSuggestedCode = '1001.99'; // wheat / grain seeds
    confidenceScore = 95;
    alternativeCodes = [
      { code: '1001.11', confidence: 92, label: 'Durum wheat seed for sowing purposes' },
      { code: '1209.91', confidence: 80, label: 'Vegetable seeds for sowing transactions' }
    ];
    productCategory = 'Cereal Grains & Sowing Grass Seeds';
    customsClassification = 'Category II Critical Agricultural Inputs';
    dutyPercent = 3;
    taxPercent = 5; // Reduced rate for food and agricultural sovereignty
    processingFee = 180;
    regulatoryNotes = 'Requires Ministry of Agriculture grain test certification, phytosanitary release document, and chemical treatment report at port of entry. Fast-tracked for domestic distribution.';
    typeApprovalRequired = true;
    greenLaneEligible = true;
    riskScore = 12;
  } else if (normName.includes('phone') || normName.includes('mobile') || normName.includes('telecom') || normDesc.includes('radio') || normName.includes('5g') || normName.includes('fiber')) {
    hsSuggestedCode = '8517.62';
    confidenceScore = 97;
    alternativeCodes = [
      { code: '8517.13', confidence: 91, label: 'Smartphones for cellular network terminals' },
      { code: '8517.79', confidence: 85, label: 'Other parts of transmitting and reception apparatus' }
    ];
    productCategory = 'MIMO Transceivers & Fiber Multiplexing';
    customsClassification = 'Category IV High-Tech Equipment';
    dutyPercent = 8;
    taxPercent = 10;
    processingFee = 300;
    regulatoryNotes = 'Requires IMEI registration, cellular radio spectrum authorization from the National Communications Commission, and security module screening against the Ministry of Interior blacklist.';
    typeApprovalRequired = true;
    greenLaneEligible = true;
    riskScore = 22;
  }

  // Calculate taxes on value
  const val = input.invoiceValue > 0 ? input.invoiceValue : 250000;
  const dutyAmt = Math.round(val * (dutyPercent / 100));
  const taxAmt = Math.round(val * (taxPercent / 100));
  const totalCost = dutyAmt + taxAmt + processingFee;

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (riskScore > 35) riskLevel = 'HIGH';
  else if (riskScore > 20) riskLevel = 'MEDIUM';

  const riskNotes = [
    `Exporter verified under CBI Safe-Trading Whitelist (CBI-ST-${4000 + Math.round(Math.random() * 5000)})`,
    greenLaneEligible 
      ? 'Umm Qasr South Port / Airport cargo terminal designated as a green-lane node'
      : 'COSQC physical sampling required at land entry boundary',
    `Secure backup server synced with central Baghdad Cloud centers for real-time tracking`
  ];

  // Logistics routing setup
  let origin = 'Shanghai Port, China';
  let transitPort = 'Umm Qasr South Terminal, Basra';
  let routeConfidence = 93;
  let shippingLine = 'Maersk Line Integrated Logistics';
  let etaDays = 24;

  if (input.originCountry.toLowerCase().includes('germany') || input.originCountry.toLowerCase().includes('ger')) {
    origin = 'Munich Airport (MUC), Germany';
    transitPort = 'Baghdad International Cargo Terminal (BGW)';
    shippingLine = 'Lufthansa Cargo AG / Middle East Express';
    routeConfidence = 97;
    etaDays = 4;
  } else if (input.originCountry.toLowerCase().includes('turkey') || input.originCountry.toLowerCase().includes('tur')) {
    origin = 'Iskenderun Port, Turkey';
    transitPort = 'Ibrahim Khalil Border Crossing, Zakho';
    shippingLine = 'Aras Logistics Ground Fleet';
    routeConfidence = 92;
    etaDays = 6;
  } else if (input.originCountry.toLowerCase().includes('jordan') || input.originCountry.toLowerCase().includes('jor')) {
    origin = 'Aqaba Sea Port, Jordan';
    transitPort = 'Trebil Border Crossing, Anbar';
    shippingLine = 'Hashemite Overland Transport Corp';
    routeConfidence = 90;
    etaDays = 5;
  } else if (input.originCountry.toLowerCase().includes('korea') || input.originCountry.toLowerCase().includes('kor')) {
    origin = 'Incheon International Airport (ICN), South Korea';
    transitPort = 'Baghdad International Cargo Terminal (BGW)';
    shippingLine = 'Asiana Cargo Flight Express';
    routeConfidence = 95;
    etaDays = 5;
  }

  // Adjust for air transport
  if (input.transportMethod === 'Air Freight') {
    if (etaDays > 7) {
      etaDays = 5;
    }
    shippingLine = 'Iraqi Airways Cargo / DHL Express';
    transitPort = 'Baghdad International Cargo Terminal (BGW)';
  } else if (input.transportMethod === 'Land Freight') {
    if (etaDays > 10) {
      etaDays = 7;
    }
    shippingLine = 'Middle East Overland Freight Carrier';
  }

  const timelineNodes: RouteTimelineNode[] = [
    {
      id: 'step_1',
      stageName: 'Origin Dispatch',
      location: origin,
      daysOffset: 0,
      status: 'COMPLETED',
      description: `Cargo container loaded and sealed. Digital Manifest dispatched to Iraq Digital Gateway system.`
    },
    {
      id: 'step_2',
      stageName: input.transportMethod === 'Air Freight' ? 'In-Flight Transit' : 'In-Transit Freight',
      location: input.transportMethod === 'Air Freight' ? 'International Air Corridor' : 'International Sea and Land Corridors',
      daysOffset: Math.round(etaDays * 0.35),
      status: 'COMPLETED',
      description: 'Shipment departed. Live location tracking telemetry via GPS active and secure.'
    },
    {
      id: 'step_3',
      stageName: 'Iraqi Boundary Arrival',
      location: transitPort,
      daysOffset: Math.round(etaDays * 0.7),
      status: 'IN_TRANSIT',
      description: `Clearing border security checkpoints. AI Customs Gateway performing pre-classification match.`
    },
    {
      id: 'step_4',
      stageName: 'Customs & Tariff Collection',
      location: transitPort,
      daysOffset: Math.round(etaDays * 0.8),
      status: 'PENDING',
      description: `Automated assessment of ${dutyPercent}% Tariff + ${taxPercent}% Sales Tax. Escrow payment link ready.`
    },
    {
      id: 'step_5',
      stageName: 'Sovereign Transit Route',
      location: 'Federal Highway Link',
      daysOffset: Math.round(etaDays * 0.9),
      status: 'PENDING',
      description: `Secure internal convoy transit under Federal electronic lock seals toward the regional terminal.`
    },
    {
      id: 'step_6',
      stageName: 'Final Gateway Clearance',
      location: `${input.destinationCity} Dry Port Terminal`,
      daysOffset: etaDays,
      status: 'PENDING',
      description: `Off-loading at ${input.destinationCity} digital logistics yard, formal handover and gate release.`
    }
  ];

  return {
    id: `SCN-${Date.now().toString().substring(7)}`,
    title: `Sovereign Cargo Declaration for ${input.quantity} Units`,
    description: `Cargo flow from ${input.originCountry} to ${input.destinationCity} via ${input.transportMethod}.`,
    input,
    analysis: {
      hsSuggestedCode,
      confidenceScore,
      alternativeCodes,
      productCategory,
      customsClassification,
      regulatoryNotes,
      greenLaneEligible,
      typeApprovalRequired
    },
    tax: {
      customsDutyPercent: dutyPercent,
      customsDutyAmount: dutyAmt,
      importTaxPercent: taxPercent,
      importTaxAmount: taxAmt,
      processingFee,
      totalEstimatedCost: totalCost,
      cifMultiplier: 1.12
    },
    compliance: {
      importAllowed: true,
      noRestrictedGoodsDetected: true,
      customsClassificationValid: true,
      documentationRequirementsPassed: true,
      riskScore,
      riskLevel,
      sanctionsPassed: true,
      cbiVerified: true,
      securityNotes: riskNotes
    },
    documents: [
      { id: 'doc_1', name: 'Commercial Invoice', description: 'Certified commercial pricing sheet showing CIF transactional breakdown.', status: 'APPROVED', isRequired: true, updatedAt: 'Approved on Oct 28' },
      { id: 'doc_2', name: 'Packing List', description: 'Itemized bundle contents showing net weight, dimensions, and battery certificates.', status: 'APPROVED', isRequired: true },
      { id: 'doc_3', name: 'Bill of Lading', description: 'Frictionless electronic consignment note issued by shipper.', status: 'APPROVED', isRequired: true },
      { id: 'doc_4', name: 'Certificate of Origin', description: 'Original trade certificate authenticated by foreign Export Council.', status: 'APPROVED', isRequired: true },
      { id: 'doc_5', name: 'Import License', description: 'Federal Ministry of Trade issued certificate for import clearance.', status: 'PENDING', isRequired: true }
    ],
    logistics: {
      origin,
      port: transitPort,
      destination: `${input.destinationCity}, Iraq`,
      etaDays,
      routeConfidence,
      shippingLine,
      containerType: '40ft High-Cube consolidated container',
      timeline: timelineNodes
    }
  };
}
