import { writable } from 'svelte/store';
import { getMe, login as apiLogin, logout as apiLogout } from '$lib/api/auth';
import type { LoginInput, SessionUser } from '$lib/schemas/auth.schema';

function createAuthStore() {
	const { subscribe, set } = writable<SessionUser | null>(null);
	return {
		subscribe,
		setSession: (user: SessionUser) => set(user),
		clearSession: () => set(null),
		login: async (input: LoginInput): Promise<SessionUser> => {
			const user = await apiLogin(input);
			set(user);
			return user;
		},
		loadMe: async (): Promise<SessionUser | null> => {
			try {
				const user = await getMe();
				set(user);
				return user;
			} catch {
				set(null);
				return null;
			}
		},
		logout: async (): Promise<void> => {
			await apiLogout();
			set(null);
		}
	};
}

export const auth = createAuthStore();

/** Central 401 handler target (imported dynamically by api/client to avoid cycles). */
export function clearSession(): void {
	auth.clearSession();
}
