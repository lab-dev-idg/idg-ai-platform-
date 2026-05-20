export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'AT_BORDER' | 'CLEARED' | 'DELIVERED';
  createdAt: number;
  updatedAt: number;
}
