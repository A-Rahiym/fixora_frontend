import { apiClient } from './client';
import {
	LowStockResponseSchema,
	PipelineResponseSchema,
	RecentActivityResponseSchema,
	SummaryResponseSchema,
	toAlertItem,
	toCapacity,
	toRecentJob,
	toRevenue,
	type DashboardData
} from '$lib/schemas/dashboard.schema';

/**
 * Thin dashboard transport — fans out to the four overview endpoints in
 * parallel and composes one DashboardData. Real errors propagate (no fixtures).
 */
export async function getDashboardData(): Promise<DashboardData> {
	const [summary, activity, pipeline, lowStock] = await Promise.all([
		apiClient.get('/api/v1/dashboard/summary'),
		apiClient.get('/api/v1/dashboard/recent-activity'),
		apiClient.get('/api/v1/dashboard/repair-pipeline'),
		apiClient.get('/api/v1/dashboard/low-stock')
	]);
	const parsedSummary = SummaryResponseSchema.parse(summary);
	const parsedActivity = RecentActivityResponseSchema.parse(activity);
	const parsedPipeline = PipelineResponseSchema.parse(pipeline);
	const parsedLowStock = LowStockResponseSchema.parse(lowStock);
	return {
		metrics: parsedSummary.data.metrics,
		revenue: toRevenue(parsedSummary.data.revenue),
		recentJobs: parsedActivity.data.recent_jobs.map(toRecentJob),
		alerts: parsedLowStock.data.low_stock_items.map(toAlertItem),
		capacity: toCapacity(parsedPipeline.data.capacity),
		deviceMix: parsedSummary.data.device_mix
	};
}
