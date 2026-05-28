/**
 * Iraq Digital Gateway (IDG)
 * International HS Code Intelligence Layer - Phase 12-H
 *
 * Implements harmonization compatibility models mapping Iraq HS codes
 * to regional frameworks (GCC Customs, EU TARIC, AP-Trade, WCO standards)
 * to detect tariff mismatches and suggest trade harmonization strategies.
 */

export interface HSCodeMapping {
  wco6Digit: string;
  iraqCode: string;
  euTaricCode: string;
  gccCode: string;
  description: string;
  tariffs: {
    iraqPercent: number;
    euPercent: number;
    gccPercent: number;
  };
}

export interface CompatibilityCheckReport {
  isCompatible: boolean;
  detectedMismatches: string[];
  proposedMappings: Array<{
    targetSystem: string;
    suggestedCode: string;
    tariffVariancePercent: number;
  }>;
  harmonizationLayerLabel: string;
  auditSignature: string;
}

export class GlobalHSCodeIntelligence {
  private static instance: GlobalHSCodeIntelligence;

  // Real mock core dictionary of verified sensitive classifications
  private mappings: Map<string, HSCodeMapping> = new Map();

  private constructor() {
    this.bootstrapStandardHSMappings();
  }

  public static getInstance(): GlobalHSCodeIntelligence {
    if (!this.instance) {
      this.instance = new GlobalHSCodeIntelligence();
    }
    return this.instance;
  }

  private bootstrapStandardHSMappings(): void {
    const baselineRecords: HSCodeMapping[] = [
      {
        wco6Digit: '870323',
        iraqCode: '87032390',
        euTaricCode: '8703231900',
        gccCode: '87032300',
        description: 'Motor vehicles, spark-ignition internal combustion reciprocating piston engine, cyl cap > 1500cc but <= 3000cc',
        tariffs: { iraqPercent: 15.0, euPercent: 10.0, gccPercent: 5.0 }
      },
      {
        wco6Digit: '851713',
        iraqCode: '85171300',
        euTaricCode: '8517130000',
        gccCode: '85171310',
        description: 'Smartphones for cellular networks or for other wireless networks',
        tariffs: { iraqPercent: 5.0, euPercent: 0.0, gccPercent: 5.0 }
      },
      {
        wco6Digit: '300490',
        iraqCode: '30049000',
        euTaricCode: '3004900090',
        gccCode: '30049090',
        description: 'Medicaments consisting of mixed or unmixed products for therapeutic/prophylactic uses, in measured doses',
        tariffs: { iraqPercent: 0.0, euPercent: 0.0, gccPercent: 0.0 } // Essential medicine exemption
      },
      {
        wco6Digit: '847130',
        iraqCode: '84713000',
        euTaricCode: '8471300000',
        gccCode: '84713010',
        description: 'Data processing machines, portable, weighing <= 10 kg, consisting of at least a CPU, keyboard, display',
        tariffs: { iraqPercent: 8.0, euPercent: 0.0, gccPercent: 5.0 }
      }
    ];

    baselineRecords.forEach(m => this.mappings.set(m.wco6Digit, m));
  }

  /**
   * Evaluates if a specified local HS code aligns with target customs systems.
   */
  public analyzeCompatibility(iraqHSCode: string, targetSystem: 'EU_TARIC' | 'GCC_CUSTOMS' | 'WCO_6D'): CompatibilityCheckReport {
    // Extract base 6 digits (WCO standard baseline)
    const base6 = iraqHSCode.substring(0, 6);
    const mapping = this.mappings.get(base6);

    const mismatches: string[] = [];
    const proposed: Array<{ targetSystem: string; suggestedCode: string; tariffVariancePercent: number }> = [];

    // Safe signature
    const sig = `SIG-WCO-${base6}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!mapping) {
      return {
        isCompatible: false,
        detectedMismatches: [`HS Base Chapter [${base6}] is not registered inside the sovereign WCO alignment ledger.`],
        proposedMappings: [],
        harmonizationLayerLabel: 'WCO_UNLINKED_CLASS_INVESTIGATION_REQUIRED',
        auditSignature: sig
      };
    }

    // Checking alignment mapping differences
    if (targetSystem === 'EU_TARIC') {
      const match = mapping.iraqCode === mapping.euTaricCode.substring(0, mapping.iraqCode.length);
      if (!match) {
        mismatches.push(`Digit length or suffix mismatch. Iraq uses [${mapping.iraqCode}] (${mapping.tariffs.iraqPercent}%) while EU Taric uses [${mapping.euTaricCode}] (${mapping.tariffs.euPercent}%).`);
        proposed.push({
          targetSystem: 'EU_TARIC',
          suggestedCode: mapping.euTaricCode,
          tariffVariancePercent: parseFloat((mapping.tariffs.euPercent - mapping.tariffs.iraqPercent).toFixed(2))
        });
      }
    } else if (targetSystem === 'GCC_CUSTOMS') {
      const match = mapping.iraqCode === mapping.gccCode;
      if (!match) {
        mismatches.push(`Suffix discrepancy. Iraq uses [${mapping.iraqCode}] while GCC unified customs uses [${mapping.gccCode}].`);
        proposed.push({
          targetSystem: 'GCC_CUSTOMS',
          suggestedCode: mapping.gccCode,
          tariffVariancePercent: parseFloat((mapping.tariffs.gccPercent - mapping.tariffs.iraqPercent).toFixed(2))
        });
      }
    } else {
      // WCO 6-D baseline check
      if (iraqHSCode.length < 6 || !iraqHSCode.startsWith(base6)) {
        mismatches.push(`Iraqi sub-code prefix [${iraqHSCode}] is out-of-sync with core WCO-6D [${base6}].`);
      }
    }

    const isCompatible = mismatches.length === 0;

    return {
      isCompatible,
      detectedMismatches: mismatches,
      proposedMappings: proposed,
      harmonizationLayerLabel: isCompatible ? 'FULLY_ALIGNED_WCO' : 'HARMONIZATION_PROBED_GATING',
      auditSignature: sig
    };
  }

  /**
   * Returns standard definition of HS Code sub-chapter.
   */
  public getHSCodeMetadata(code: string): HSCodeMapping | undefined {
    return this.mappings.get(code.substring(0, 6));
  }

  public getMappingsList(): HSCodeMapping[] {
    return Array.from(this.mappings.values());
  }
}
