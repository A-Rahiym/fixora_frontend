import { z } from 'zod';

export const RepairStatusSchema = z.enum([
	'received',
	'diagnosing',
	'awaiting_approval',
	'approved',
	'in_repair',
	'quality_check',
	'ready_for_collection',
	'collected',
	'on_hold',
	'unrepairable',
	'cancelled'
]);
export type RepairStatus = z.infer<typeof RepairStatusSchema>;

export const RepairPrioritySchema = z.enum(['High', 'Medium', 'Low']);
export type RepairPriority = z.infer<typeof RepairPrioritySchema>;

export const RepairSchema = z.object({
	id: z.number(),
	jobNumber: z.string(),
	status: RepairStatusSchema,
	priority: RepairPrioritySchema,
	customer: z.object({ id: z.number(), name: z.string(), phone: z.string() }),
	device: z.object({ id: z.number(), brand: z.string(), model: z.string() }),
	technician: z.object({ id: z.number(), name: z.string() }).nullable(),
	finalCost: z.number().nullable(),
	createdAt: z.string(),
	dueDate: z.string().nullable()
});
export type Repair = z.infer<typeof RepairSchema>;

export const RepairListSchema = z.array(RepairSchema);

export const RepairSortSchema = z.enum(['newest', 'oldest']);
export type RepairSort = z.infer<typeof RepairSortSchema>;

export const RepairFiltersSchema = z.object({
	status: RepairStatusSchema.optional(),
	search: z.string().optional(),
	sort: RepairSortSchema.optional(),
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(1).max(100).optional()
});
export type RepairFilters = z.infer<typeof RepairFiltersSchema>;

export const RepairPageSchema = z.object({
	data: z.array(RepairSchema),
	total: z.number(),
	page: z.number(),
	perPage: z.number(),
	lastPage: z.number()
});
export type RepairPage = z.infer<typeof RepairPageSchema>;
