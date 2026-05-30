import { ImporterProductInput, CustomsScenario } from './types';

export const LAPTOP_SCENARIO_INPUT: ImporterProductInput = {
  productName: 'ThinBook Pro High-Perf Laptop Computers',
  productDescription: 'Portable computers containing Intel Core i7 CPUs, 16GB LPDDR5 RAM, 512GB NVMe SSD with integrated lithium-ion batteries. Approved for educational and corporate deployments in Erbil Governorate.',
  quantity: 500,
  originCountry: 'China',
  invoiceValue: 250000,
  destinationCity: 'Erbil',
  transportMethod: 'Sea Freight'
};

export const MOCK_SCENARIOS: Record<string, ImporterProductInput> = {
  laptops: LAPTOP_SCENARIO_INPUT,
  pharmaceuticals: {
    productName: 'Essential Vaccines & Medical Packs',
    productDescription: 'Temperature-controlled cardiovascular medicines and vaccinations. High priority sovereign import. To be delivered to Erbil North Medical Depot.',
    quantity: 1200,
    originCountry: 'Germany',
    invoiceValue: 430000,
    destinationCity: 'Erbil',
    transportMethod: 'Air Freight'
  },
  construction: {
    productName: 'Heavy Structural Steel Rebar Bundles',
    productDescription: 'Grade 60 carbon steel reinforcing bars for regional infrastructure construction projects in Northern Iraq.',
    quantity: 180,
    originCountry: 'Turkey',
    invoiceValue: 145000,
    destinationCity: 'Erbil',
    transportMethod: 'Land Freight'
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
  let riskScore = 18;

  if (normName.includes('vaccine') || normName.includes('medic') || normName.includes('pharm') || normDesc.includes('medical')) {
    hsSuggestedCode = '3004.90';
    confidenceScore = 98;
    alternativeCodes = [
      { code: '3004.50', confidence: 88, label: 'Medicaments containing vitamins/other products' },
      { code: '3002.15', confidence: 81, label: 'Immunological products, mixed or put up in measured doses' }
    ];
    productCategory = 'Medicaments & Pharmaceutical Prep';
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
    riskScore = 32;
  } else if (normName.includes('phone') || normName.includes('mobile') || normName.includes('telecom') || normDesc.includes('radio')) {
    hsSuggestedCode = '8517.13';
    confidenceScore = 95;
    alternativeCodes = [
      { code: '8517.18', confidence: 90, label: 'Other telephone sets and devices for transmitting voices' },
      { code: '8517.62', confidence: 83, label: 'Machines for reception, conversion & transmission of voices/data' }
    ];
    productCategory = 'Smartphones & Terminal Communication Devices';
    customsClassification = 'Category IV High-Tech Equipment';
    dutyPercent = 10;
    taxPercent = 10;
    processingFee = 250;
    regulatoryNotes = 'Requires IMEI registration, cellular radio spectrum authorization from the National Communications Commission, and security module screening against the Ministry of Interior blacklist.';
    typeApprovalRequired = true;
    greenLaneEligible = true;
    riskScore = 22;
  }

  // Multiply by input quantity / value if user changes them
  const val = input.invoiceValue > 0 ? input.invoiceValue : 250000;
  const dutyAmt = Math.round(val * (dutyPercent / 100));
  const taxAmt = Math.round(val * (taxPercent / 100));
  const totalCost = dutyAmt + taxAmt + processingFee;

  // Set risk category based on score
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (riskScore > 40) riskLevel = 'HIGH';
  else if (riskScore > 25) riskLevel = 'MEDIUM';

  const riskNotes = [
    `Exporter verified under CBI Safe-Trading Whitelist (CBI-ST-${3000 + Math.round(Math.random() * 6000)})`,
    greenLaneEligible 
      ? 'Umm Qasr South Port designated as a green-lane node for verified software'
      : 'COSQC physical sampling required at land entry point',
    `Customs assessment node configured for active-active backup routing to primary Baghdad cloud centers`
  ];

  // Logistics routing
  let origin = 'Shanghai Port, China';
  let transitPort = 'Umm Qasr South Terminal, Basra';
  let routeConfidence = 93;
  let shippingLine = 'Maersk Line Integrated Logistics';
  let etaDays = 21;

  if (input.originCountry.toLowerCase() === 'germany' || input.originCountry.toLowerCase().includes('germ')) {
    origin = 'Munich Airport (MUC), Germany';
    transitPort = 'Baghdad International Cargo Terminal (BGW)';
    shippingLine = 'Lufthansa Cargo AG / Middle East Exp';
    routeConfidence = 97;
    etaDays = 4;
  } else if (input.originCountry.toLowerCase() === 'turkey' || input.originCountry.toLowerCase().includes('turk')) {
    origin = 'Iskenderun Port, Turkey';
    transitPort = 'Ibrahim Khalil Border Crossing, Zakho';
    shippingLine = 'Aras Logistics Ground Fleet';
    routeConfidence = 91;
    etaDays = 6;
  }

  // Adjust routing for other input methods
  if (input.transportMethod === 'Air Freight') {
    if (etaDays > 7) {
      etaDays = 5;
    }
    shippingLine = 'Iraqi Airways Cargo / DHL Express';
    transitPort = 'Erbil International Airport Cargo Terminal (EBL)';
    routeConfidence = 95;
  } else if (input.transportMethod === 'Land Freight') {
    if (etaDays > 10) {
      etaDays = 8;
    }
    shippingLine = 'Middle East Overland Freight Carrier';
    transitPort = 'Ibrahim Khalil Border Crossing, Zakho';
  }

  const timelineNodes: RouteTimelineNode[] = [
    {
      id: 'step_1',
      stageName: 'Origin Dispatch',
      location: origin,
      daysOffset: 0,
      status: 'COMPLETED',
      description: `Cargo container loaded and sealed. Digital Manifest (Hashed: sha256_e8d3...) dispatched to Iraq Gateway.`
    },
    {
      id: 'step_2',
      stageName: input.transportMethod === 'Air Freight' ? 'In-Flight Transit' : 'Ocean Leg Cargo Freight',
      location: input.transportMethod === 'Air Freight' ? 'International Air Corridor' : 'South China Sea / Arabian Sea',
      daysOffset: Math.round(etaDays * 0.3),
      status: 'COMPLETED',
      description: 'Shipment dispatched from origin airport/sea node. Tracking telemetry stream active.'
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
      description: `Automated assessment of ${dutyPercent}% Tariff + ${taxPercent}% Sales Tax. Escrow payment release.`
    },
    {
      id: 'step_5',
      stageName: 'Sovereign Transit Route',
      location: 'Federal Highway Express Link',
      daysOffset: Math.round(etaDays * 0.95),
      status: 'PENDING',
      description: `Secure internal convoy transit under Federal electronic lock seals toward the Kurdistan Region.`
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
    title: `Sovereign Cargo Declaration for ${input.quantity}x ${input.productName.split(' ')[0]}`,
    description: `Cargo flow of electronics from ${input.originCountry} to ${input.destinationCity} via ${input.transportMethod}.`,
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
      { id: 'doc_1', name: 'Commercial Invoice', description: 'Certified commercial pricing sheet showing CIF transactional breakdown.', status: 'APPROVED', isRequired: true, updatedAt: 'Overlooked on 28-May' },
      { id: 'doc_2', name: 'Packing List', description: 'Itemized bundle contents showing net weight, dimensions, and battery certificates.', status: 'APPROVED', isRequired: true },
      { id: 'doc_3', name: 'Bill of Lading', description: 'Frictionless electronic consignment note issued by shipper Maersk Corp.', status: 'APPROVED', isRequired: true },
      { id: 'doc_4', name: 'Certificate of Origin', description: 'Original trade certificate authenticated by China Council for the Promotion of International Trade (CCPIT).', status: 'APPROVED', isRequired: true },
      { id: 'doc_5', name: 'Import License', description: 'Kurdistan Regional Government (KRG) and KRG Ministry of Trade issued import certificate.', status: 'APPROVED', isRequired: true }
    ],
    logistics: {
      origin,
      port: transitPort,
      destination: `${input.destinationCity}, Iraq`,
      etaDays,
      routeConfidence,
      shippingLine,
      containerType: '40ft High-Cube Reefer Consolidated',
      timeline: timelineNodes
    }
  };
}
