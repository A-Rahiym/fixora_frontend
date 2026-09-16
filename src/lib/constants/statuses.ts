import type { RepairStatus } from '$lib/schemas/repair.schema';

export const REPAIR_STATUSES: RepairStatus[] = [
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
];

export const REPAIR_STATUS_LABELS: Record<RepairStatus, string> = {
	received: 'Received',
	diagnosing: 'Diagnosing',
	awaiting_approval: 'Awaiting approval',
	approved: 'Approved',
	in_repair: 'In repair',
	quality_check: 'Quality check',
	ready_for_collection: 'Ready for collection',
	collected: 'Collected',
	on_hold: 'On hold',
	unrepairable: 'Unrepairable',
	cancelled: 'Cancelled'
};
