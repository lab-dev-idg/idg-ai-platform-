export interface CustomsRecord {
  id: string;
  shipmentId: string;
  hsCode: string;
  declaredValue: number;
  assessedValue: number;
  tariffRate: number;
  totalDuty: number;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
}
