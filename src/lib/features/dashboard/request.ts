import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { getDashboardData } from '$lib/api/dashboard';
import { queryKeys } from '$lib/constants/queryKeys';
import type { DashboardData } from '$lib/schemas/dashboard.schema';

/**
 * TanStack Query options for the dashboard (guide §3 — cached server state,
 * shared staleTime, invalidation on mutation; never manual fetch + set).
 * Pure options factory: no fetching here — the query owns the request.
 */
export function dashboardQueryOptions(): CreateQueryOptions<DashboardData> {
	return {
		queryKey: queryKeys.dashboard,
		queryFn: getDashboardData
	};
}
