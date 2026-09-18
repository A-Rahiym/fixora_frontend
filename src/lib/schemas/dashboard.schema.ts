import { z } from 'zod';
import { statusTone } from '$lib/constants/statuses';
import type { RepairStatus } from '$lib/schemas/repair.schema';

export const MetricSchema = z.object({
	id: z.string(),
	label: z.string(),
	value: z.string(),
	caption: z.string().optional(),
	trend: z.object({ direction: z.enum(['up', 'down']), text: z.string() }).optional(),
	actionLabel: z.string().optional(),
	actionHref: z.string().optional()
});
export type Metric = z.infer<typeof MetricSchema>;

export const RevenuePointSchema = z.object({
	label: z.string(),
	current: z.number(),
	previous: z.number()
});
export type RevenuePoint = z.infer<typeof RevenuePointSchema>;

/** Backend revenue block (snake_case). */
export const RevenueResourceSchema = z.object({
	current_total: z.number(),
	previous_total: z.number(),
	points: z.array(RevenuePointSchema)
});

export interface Revenue {
	currentTotal: number;
	previousTotal: number;
	points: RevenuePoint[];
}

export function toRevenue(resource: z.infer<typeof RevenueResourceSchema>): Revenue {
	return {
		currentTotal: resource.current_total,
		previousTotal: resource.previous_total,
		points: resource.points
	};
}

export const RecentJobSchema = z.object({
	id: z.number(),
	jobNumber: z.string(),
	customer: z.string(),
	device: z.string(),
	issue: z.string(),
	status: z.string(),
	statusTone: z.enum(['info', 'warning', 'success', 'muted']),
	priority: z.enum(['High', 'Medium', 'Low'])
});
export type RecentJob = z.infer<typeof RecentJobSchema>;

/** Backend recent-job row (snake_case, lowercase priority, no tone). */
export const RecentJobResourceSchema = z.object({
	id: z.number(),
	job_number: z.string(),
	customer: z.string(),
	device: z.string(),
	issue: z.string(),
	status: z.string(),
	priority: z.string(),
	created_at: z.string()
});

const PRIORITY_MAP: Record<string, RecentJob['priority']> = {
	high: 'High',
	low: 'Low',
	normal: 'Medium'
};

export function toRecentJob(resource: z.infer<typeof RecentJobResourceSchema>): RecentJob {
	return {
		id: resource.id,
		jobNumber: resource.job_number,
		customer: resource.customer,
		device: resource.device,
		issue: resource.issue,
		status: resource.status,
		statusTone: statusTone(resource.status as RepairStatus),
		priority: PRIORITY_MAP[resource.priority.toLowerCase()] ?? 'Medium'
	};
}

export const AlertItemSchema = z.object({
	id: z.string(),
	severity: z.enum(['critical', 'warning', 'info']),
	title: z.string(),
	detail: z.string(),
	timeAgo: z.string().optional()
});
export type AlertItem = z.infer<typeof AlertItemSchema>;

/** Backend low-stock row. No timestamp — timeAgo stays unset. */
export const LowStockItemSchema = z.object({
	id: z.number(),
	name: z.string(),
	sku: z.string().nullable().optional(),
	quantity: z.number(),
	threshold: z.number()
});

export function toAlertItem(item: z.infer<typeof LowStockItemSchema>): AlertItem {
	return {
		id: `low-stock-${item.id}`,
		severity: item.quantity === 0 ? 'critical' : 'warning',
		title: `${item.name} Low`,
		detail: `Stock level: ${item.quantity} units. Reorder point triggered.`
	};
}

export const CapacityEntrySchema = z.object({
	technician: z.string(),
	role: z.string(),
	loadPct: z.number(),
	jobs: z.number()
});
export type CapacityEntry = z.infer<typeof CapacityEntrySchema>;

/** Backend capacity block (snake_case). */
export const CapacityResourceSchema = z.object({
	utilization_pct: z.number(),
	entries: z.array(
		z.object({ technician: z.string(), role: z.string(), load_pct: z.number(), jobs: z.number() })
	)
});

export interface Capacity {
	utilizationPct: number;
	entries: CapacityEntry[];
}

export function toCapacity(resource: z.infer<typeof CapacityResourceSchema>): Capacity {
	return {
		utilizationPct: resource.utilization_pct,
		entries: resource.entries.map((e) => ({ ...e, loadPct: e.load_pct }))
	};
}

export const DeviceMixEntrySchema = z.object({
	category: z.string(),
	count: z.number(),
	pct: z.number()
});
export type DeviceMixEntry = z.infer<typeof DeviceMixEntrySchema>;

/** Backend device-mix rows (already camel-compatible). */
export const DeviceMixResourceSchema = z.array(DeviceMixEntrySchema);

export const DashboardDataSchema = z.object({
	metrics: z.array(MetricSchema),
	revenue: z.object({
		currentTotal: z.number(),
		previousTotal: z.number(),
		points: z.array(RevenuePointSchema)
	}),
	recentJobs: z.array(RecentJobSchema),
	alerts: z.array(AlertItemSchema),
	capacity: z.object({ utilizationPct: z.number(), entries: z.array(CapacityEntrySchema) }),
	deviceMix: z.array(DeviceMixEntrySchema)
});
export type DashboardData = z.infer<typeof DashboardDataSchema>;

/** Backend summary envelope: metrics + revenue + device_mix (snake_case). */
export const SummaryResponseSchema = z.object({
	data: z.object({
		metrics: z.array(MetricSchema),
		revenue: RevenueResourceSchema,
		device_mix: DeviceMixResourceSchema
	}),
	message: z.string()
});

/** Backend recent-activity envelope. */
export const RecentActivityResponseSchema = z.object({
	data: z.object({ recent_jobs: z.array(RecentJobResourceSchema) }),
	message: z.string()
});

/** Backend repair-pipeline envelope. */
export const PipelineResponseSchema = z.object({
	data: z.object({ capacity: CapacityResourceSchema }),
	message: z.string()
});

/** Backend low-stock envelope. */
export const LowStockResponseSchema = z.object({
	data: z.object({ low_stock_items: z.array(LowStockItemSchema) }),
	message: z.string()
});
