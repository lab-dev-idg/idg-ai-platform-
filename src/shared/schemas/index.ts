import { z } from 'zod';

export const CustomsCalculationSchema = z.object({
  hsCode: z.string().optional(),
  productName: z.string(),
  valueUSD: z.number().positive(),
  originPort: z.string(),
  destinationPort: z.string(),
  weightKg: z.number().positive().optional(),
});

export type CustomsCalculationInput = z.infer<typeof CustomsCalculationSchema>;

export const CustomsResultSchema = z.object({
  estimatedTariffPercent: z.number(),
  estimatedTotalUSD: z.number(),
  clearanceTimeHours: z.number(),
  notes: z.string(),
});

export type CustomsResult = z.infer<typeof CustomsResultSchema>;

export const AIPayloadSchema = z.object({
  action: z.string(),
  payload: z.record(z.any()),
  confidence: z.number().min(0).max(1),
  metadata: z.record(z.any()).optional(),
});

export type AIPayload = z.infer<typeof AIPayloadSchema>;
