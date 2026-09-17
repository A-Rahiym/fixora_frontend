import { get } from 'svelte/store';
import { auth } from '$lib/stores/auth';

/** Screen feature: ensure session is fresh, return the dashboard greeting. */
export async function getDashboardGreeting(): Promise<string> {
	const user = get(auth) ?? (await auth.loadMe());
	return user ? `Welcome, ${user.name}.` : 'Shop overview lands here in Phase 9.';
}
