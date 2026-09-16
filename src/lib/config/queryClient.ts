import { QueryClient } from '@tanstack/svelte-query';

/**
 * Shared QueryClient defaults for Fixora (guide §3 — every module uses
 * TanStack Query; mutations invalidate instead of patching cache).
 */
export function createAppQueryClient(): QueryClient {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 30_000,
				gcTime: 5 * 60_000,
				retry: 1,
				refetchOnWindowFocus: true
			},
			mutations: {
				retry: 0
			}
		}
	});
}
