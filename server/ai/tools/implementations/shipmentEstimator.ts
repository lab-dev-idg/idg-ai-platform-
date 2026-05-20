import { AITool } from '../../types';
import { z } from 'zod';

const ShipmentEstimatorSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  containerType: z.enum(['20FT', '40FT', 'LCL']),
  weightKg: z.number().optional(),
});

export const shipmentEstimatorTool: AITool = {
  name: 'shipment_estimator',
  description: 'Estimates shipping time and container costs between origins and Iraq.',
  execute: async (input: unknown) => {
    const parsed = ShipmentEstimatorSchema.parse(input);
    
    // Simple operational logic
    const { origin, destination, containerType } = parsed;
    const isChina = origin.toLowerCase().includes('china') || origin.toLowerCase().includes('shanghai');
    
    let baseCost = containerType === '40FT' ? 3500 : 2000;
    let days = 30;

    if (isChina) {
      baseCost += 1000;
      days = 40;
    }

    return {
      estimatedCostUSD: baseCost,
      estimatedTransitDays: days,
      route: `${origin} -> ${destination}`,
      reliabilityScore: 0.85
    };
  }
};
