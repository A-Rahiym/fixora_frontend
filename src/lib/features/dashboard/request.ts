import { get } from 'svelte/store';
import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { auth } from '$lib/stores/auth';
import { getDashboardData } from '$lib/api/dashboard';
import { queryKeys } from '$lib/constants/queryKeys';
import type { DashboardData } from '$lib/schemas/dashboard.schema';

/** Screen feature: ensure session is fresh, return the dashboard greeting. */
export async function getDashboardGreeting(): Promise<string> {
	const user = get(auth) ?? (await auth.loadMe());
	return user ? `Welcome, ${user.name}.` : 'Shop overview lands here in Phase 9.';
}

/**
 * TanStack Query options for the dashboard (guide §3 — cached server state,
 * shared staleTime, invalidation on mutation; never manual fetch + set).
 */
export function dashboardQueryOptions(): CreateQueryOptions<DashboardData> {
	return {
		queryKey: queryKeys.dashboard,
		queryFn: getDashboardData
	};
}
