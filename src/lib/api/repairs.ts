import { apiClient } from './client';
import { RepairListSchema, RepairSchema, type Repair } from '$lib/schemas/repair.schema';

export interface RepairFilters {
	status?: string;
	search?: string;
	page?: number;
}

/**
 * Phase 0 stub: tries the real API, falls back to a static fixture so
 * frontend work is not blocked before backend Phase 1 lands.
 * (implementation-guide.md §5 — fixture mock strategy)
 */
const FIXTURE: Repair[] = [
	{
		id: 1,
		jobNumber: 'FX-0001',
		status: 'received',
		customer: { id: 1, name: 'Jane Doe', phone: '+260970000001' },
		device: { id: 1, brand: 'Samsung', model: 'Galaxy A12' },
		finalCost: null,
		createdAt: new Date().toISOString()
	}
];

export async function getRepairs(params: RepairFilters = {}): Promise<Repair[]> {
	const qs = new URLSearchParams(
		Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
			if (v !== undefined) acc[k] = String(v);
			return acc;
		}, {})
	).toString();
	try {
		return await apiClient.get(`/repairs${qs ? `?${qs}` : ''}`, RepairListSchema);
	} catch {
		return RepairListSchema.parse(FIXTURE);
	}
}

export async function getRepair(id: number): Promise<Repair> {
	try {
		return await apiClient.get(`/repairs/${id}`, RepairSchema);
	} catch {
		return RepairSchema.parse(FIXTURE[0]);
	}
}
