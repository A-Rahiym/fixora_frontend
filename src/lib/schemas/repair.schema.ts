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

export const RepairSchema = z.object({
	id: z.number(),
	jobNumber: z.string(),
	status: RepairStatusSchema,
	customer: z.object({ id: z.number(), name: z.string(), phone: z.string() }),
	device: z.object({ id: z.number(), brand: z.string(), model: z.string() }),
	finalCost: z.number().nullable(),
	createdAt: z.string()
});
export type Repair = z.infer<typeof RepairSchema>;

export const RepairListSchema = z.array(RepairSchema);
