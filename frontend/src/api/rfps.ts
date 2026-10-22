import { api } from './client';
import { Rfp, RfpLane } from '../types';

export async function getRfps(tenantId: string) {
  const response = await api.get<Rfp[]>(`/tenants/${tenantId}/rfps`);
  return response.data;
}

export async function getRfp(tenantId: string, rfpId: string) {
  const response = await api.get<Rfp>(`/tenants/${tenantId}/rfps/${rfpId}`);
  return response.data;
}

export async function getRfpLanes(tenantId: string, rfpId: string) {
  const response = await api.get<RfpLane[]>(
    `/tenants/${tenantId}/rfps/${rfpId}/lanes`,
  );
  return response.data;
}

export async function updateRfpStatus(
  tenantId: string,
  rfpId: string,
  status: Rfp['status'],
) {
  const response = await api.patch<Rfp>(`/tenants/${tenantId}/rfps/${rfpId}/status`, {
    status,
  });
  return response.data;
}

export async function getRfpLane(tenantId: string, laneId: string) {
  const response = await api.get<RfpLane>(`/tenants/${tenantId}/rfp-lanes/${laneId}`);
  return response.data;
}
