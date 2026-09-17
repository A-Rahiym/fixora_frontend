import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';
import { getMe } from '$lib/api/auth';

/** Auth guard: unauthenticated access to any (app) route redirects to /login. */
export const load: LayoutLoad = async (event) => {
	try {
		const user = await getMe();
		return { user };
	} catch {
		const next = event.url.pathname + event.url.search;
		redirect(302, `/login?redirect=${encodeURIComponent(next)}`);
	}
};
