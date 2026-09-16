import { writable } from 'svelte/store';

export interface SessionUser {
	id: number;
	name: string;
	email: string;
}

function createAuthStore() {
	const { subscribe, set } = writable<SessionUser | null>(null);
	return {
		subscribe,
		setSession: (user: SessionUser) => set(user),
		clearSession: () => set(null)
	};
}

export const auth = createAuthStore();

/** Central 401 handler target (imported dynamically by api/client to avoid cycles). */
export function clearSession(): void {
	auth.clearSession();
}
