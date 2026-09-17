import { z } from 'zod';

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

export const AlertItemSchema = z.object({
	id: z.string(),
	severity: z.enum(['critical', 'warning', 'info']),
	title: z.string(),
	detail: z.string(),
	timeAgo: z.string()
});
export type AlertItem = z.infer<typeof AlertItemSchema>;

export const CapacityEntrySchema = z.object({
	technician: z.string(),
	role: z.string(),
	loadPct: z.number(),
	jobs: z.number()
});
export type CapacityEntry = z.infer<typeof CapacityEntrySchema>;

export const DeviceMixEntrySchema = z.object({
	category: z.string(),
	count: z.number(),
	pct: z.number()
});
export type DeviceMixEntry = z.infer<typeof DeviceMixEntrySchema>;

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
