import { AITool } from '../../types';
import { z } from 'zod';

const TariffLookupSchema = z.object({
  hsCode: z.string().optional(),
  productDescription: z.string().optional(),
  targetRegion: z.enum(['KRI', 'FEDERAL_IRAQ']).default('FEDERAL_IRAQ')
});

export const tariffLookupTool: AITool = {
  name: 'tariff_lookup',
  description: 'Looks up official tariff rates for specific HS codes or products in Iraq/KRI.',
  execute: async (input: unknown) => {
    const parsed = TariffLookupSchema.parse(input);
    
    // Fake Db lookup
    if (parsed.hsCode?.startsWith('85') || parsed.productDescription?.toLowerCase().includes('electronic')) {
      return {
        hsCode: parsed.hsCode || '8500.00.00',
        description: parsed.productDescription || 'Electronics',
        region: parsed.targetRegion,
        tariffRatePercent: parsed.targetRegion === 'KRI' ? 5 : 10,
        vatRatePercent: 0,
        requiresSpecialPermit: true
      };
    }
    
    return {
      hsCode: parsed.hsCode || '0000.00.00',
      description: parsed.productDescription || 'General Goods',
      region: parsed.targetRegion,
      tariffRatePercent: 5,
      vatRatePercent: 0,
      requiresSpecialPermit: false
    };
  }
};
