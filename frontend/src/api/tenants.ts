import { api } from './client';
import { TenantSummary } from '../types';

export async function getTenants() {
  const response = await api.get<TenantSummary[]>('/tenants');
  return response.data;
}
