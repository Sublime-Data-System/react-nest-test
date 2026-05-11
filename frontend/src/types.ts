export interface User {
  id: string;
  email: string;
  fullName: string;
}

export interface TenantSummary {
  id: string;
  name: string;
  slug: string;
  role: 'admin' | 'user';
}

export interface Rfp {
  id: string;
  tenantId: string;
  title: string;
  customerName: string;
  status: 'draft' | 'active' | 'closed';
  dueDate: string;
}

export interface RfpLane {
  id: string;
  tenantId: string;
  rfpId: string;
  originCity: string;
  originState: string;
  destinationCity: string;
  destinationState: string;
  equipmentType: string;
  estimatedVolume: number;
  status: 'open' | 'awarded' | 'closed';
  rfp?: Rfp;
}
