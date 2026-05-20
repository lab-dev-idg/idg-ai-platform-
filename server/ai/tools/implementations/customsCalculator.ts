import { AITool } from '../../../../src/services/ai/types';
import { CustomsCalculationSchema } from '../../../../src/shared/schemas';

export const customsCalculatorTool: AITool = {
  name: 'customs_calculator',
  description: 'Calculates estimated customs duty and clearance time for a given product and value.',
  execute: async (input: unknown) => {
    try {
      const parsed = CustomsCalculationSchema.parse(input);
      // Simulate real calculation logic based on destination
      let tariffPercent = 5;
      
      const hsLower = parsed.hsCode?.toLowerCase() || parsed.productName.toLowerCase();
      if (hsLower.includes('electronics') || hsLower.includes('phone')) {
        tariffPercent = 10;
      } else if (hsLower.includes('car') || hsLower.includes('vehicle')) {
        tariffPercent = 15;
      }

      const isUmQasr = parsed.destinationPort.toLowerCase().includes('qasr');
      
      const estimatedTotalUSD = parsed.valueUSD * (tariffPercent / 100);
      const clearanceTimeHours = isUmQasr ? 48 : 24;

      return {
        estimatedTariffPercent: tariffPercent,
        estimatedTotalUSD,
        clearanceTimeHours,
        notes: `Calculated based on standard IRAQ/KRG tariffs. Destination: ${parsed.destinationPort}`,
      };
    } catch (e) {
      const err = e as Error;
      throw new Error(`Customs calculation failed: ${err.message}`);
    }
  }
};
