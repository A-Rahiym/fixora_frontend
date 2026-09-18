import { apiClient } from './client';
import { RepairListSchema, RepairSchema } from '$lib/schemas/repair.schema';

export interface RepairFilters {
	status?: string;
	search?: string;
	page?: number;
}

/** Thin repairs transport — real errors propagate (no fixtures). */
export async function getRepairs(params: RepairFilters = {}) {
	const qs = new URLSearchParams(
		Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
			if (v !== undefined) acc[k] = String(v);
			return acc;
		}, {})
	).toString();
	return await apiClient.get(`/repairs${qs ? `?${qs}` : ''}`, RepairListSchema);
}

export async function getRepair(id: number) {
	return await apiClient.get(`/repairs/${id}`, RepairSchema);
}
