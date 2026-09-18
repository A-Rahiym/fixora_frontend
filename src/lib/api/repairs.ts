import { apiClient } from './client';
import {
	RepairPageSchema,
	RepairSchema,
	type Repair,
	type RepairFilters,
	type RepairPage
} from '$lib/schemas/repair.schema';

/**
 * Fixture rows mirroring screens/job_list.html until the backend
 * repairs endpoints are live (implementation-guide.md §5).
 */
const FIXTURE: Repair[] = [
	{
		id: 8842,
		jobNumber: '#8842',
		status: 'in_repair',
		priority: 'High',
		customer: { id: 2, name: 'Michael Chen', phone: '+260970000002' },
		device: { id: 2, brand: 'Samsung', model: 'S22 Ultra' },
		technician: { id: 1, name: 'John Doe' },
		finalCost: 850,
		createdAt: '2026-09-14T09:00:00.000Z',
		dueDate: '2026-09-16T17:00:00.000Z'
	},
	{
		id: 8841,
		jobNumber: '#8841',
		status: 'diagnosing',
		priority: 'High',
		customer: { id: 3, name: 'Sarah Jenkins', phone: '+260970000003' },
		device: { id: 3, brand: 'Apple', model: 'iPhone 14 Pro' },
		technician: { id: 2, name: 'Sarah Smith' },
		finalCost: null,
		createdAt: '2026-09-13T14:30:00.000Z',
		dueDate: '2026-09-18T17:00:00.000Z'
	},
	{
		id: 8840,
		jobNumber: '#8840',
		status: 'ready_for_collection',
		priority: 'Medium',
		customer: { id: 4, name: 'Alice Walton', phone: '+260970000004' },
		device: { id: 4, brand: 'Apple', model: 'MacBook Pro' },
		technician: { id: 2, name: 'Sarah Smith' },
		finalCost: 1200,
		createdAt: '2026-09-12T10:15:00.000Z',
		dueDate: '2026-09-15T17:00:00.000Z'
	},
	{
		id: 8839,
		jobNumber: '#8839',
		status: 'received',
		priority: 'Low',
		customer: { id: 5, name: 'John Doe', phone: '+260970000005' },
		device: { id: 5, brand: 'Apple', model: 'iPad Air' },
		technician: null,
		finalCost: null,
		createdAt: '2026-09-11T08:45:00.000Z',
		dueDate: '2026-09-20T17:00:00.000Z'
	},
	{
		id: 8838,
		jobNumber: '#8838',
		status: 'awaiting_approval',
		priority: 'Medium',
		customer: { id: 6, name: 'Grace Mwila', phone: '+260970000006' },
		device: { id: 6, brand: 'Samsung', model: 'Galaxy A12' },
		technician: { id: 3, name: 'Michael Chen' },
		finalCost: 450,
		createdAt: '2026-09-10T16:20:00.000Z',
		dueDate: '2026-09-17T17:00:00.000Z'
	},
	{
		id: 8837,
		jobNumber: '#8837',
		status: 'collected',
		priority: 'Low',
		customer: { id: 7, name: 'Peter Banda', phone: '+260970000007' },
		device: { id: 7, brand: 'HP', model: 'Pavilion 15' },
		technician: { id: 1, name: 'John Doe' },
		finalCost: 300,
		createdAt: '2026-09-08T11:00:00.000Z',
		dueDate: '2026-09-12T17:00:00.000Z'
	}
];

function applyFixtureFilters(all: Repair[], params: RepairFilters): RepairPage {
	const search = params.search?.trim().toLowerCase();
	let rows = all.filter((r) => {
		if (params.status && r.status !== params.status) return false;
		if (search) {
			const haystack =
				`${r.jobNumber} ${r.customer.name} ${r.device.brand} ${r.device.model}`.toLowerCase();
			if (!haystack.includes(search)) return false;
		}
		return true;
	});
	rows = [...rows].sort((a, b) =>
		params.sort === 'oldest'
			? a.createdAt.localeCompare(b.createdAt)
			: b.createdAt.localeCompare(a.createdAt)
	);
	const perPage = params.perPage ?? 10;
	const total = rows.length;
	const lastPage = Math.max(1, Math.ceil(total / perPage));
	const page = Math.min(params.page ?? 1, lastPage);
	return {
		data: rows.slice((page - 1) * perPage, page * perPage),
		total,
		page,
		perPage,
		lastPage
	};
}

export async function getRepairs(params: RepairFilters = {}): Promise<RepairPage> {
	const qs = new URLSearchParams(
		Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
			if (v !== undefined) acc[k] = String(v);
			return acc;
		}, {})
	).toString();
	try {
		return await apiClient.get(`/repairs${qs ? `?${qs}` : ''}`, RepairPageSchema);
	} catch {
		return RepairPageSchema.parse(applyFixtureFilters(FIXTURE, params));
	}
}

export async function getRepair(id: number): Promise<Repair> {
	try {
		return await apiClient.get(`/repairs/${id}`, RepairSchema);
	} catch {
		const found = FIXTURE.find((r) => r.id === id) ?? FIXTURE[0];
		return RepairSchema.parse(found);
	}
}
