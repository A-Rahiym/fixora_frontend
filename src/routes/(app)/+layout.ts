import type { LayoutLoad } from './$types';

/**
 * Phase 1 will load the current user here and redirect to /login when
 * unauthenticated (guide §Phase 1). Phase 0: passthrough stub.
 */
export const load: LayoutLoad = async () => {
	return {};
};
