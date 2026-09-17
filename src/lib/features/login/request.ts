import { auth } from '$lib/stores/auth';
import { apiClient } from '$lib/api/client';
import { LoginSchema } from '$lib/schemas/auth.schema';
import type { ApiErrorShape } from '$lib/api/client';

export interface LoginFieldErrors {
	email?: string;
	password?: string;
}

export interface LoginResult {
	ok: boolean;
	error?: string;
	fieldErrors?: LoginFieldErrors;
}

type Navigator = (url: string) => Promise<void> | void;

export function mapLoginError(err: ApiErrorShape): string {
	if (err.status === 401) return 'Invalid email or password.';
	if (err.status === 403) return 'This account has been disabled. Contact your manager.';
	return err.message ?? 'Login failed. Try again.';
}

export type SystemStatus = 'operational' | 'unknown';
/** Screen feature: backend liveness for the System Status card (GET /api/health). */
export async function getSystemStatus(): Promise<SystemStatus> {
	try {
		await apiClient.get('/health');
		return 'operational';
	} catch {
		return 'unknown';
	}
}

export const DEFAULT_POST_LOGIN_TARGET = '/dashboard';

/**
 * Allow only internal post-login targets. Anything else (external URLs,
 * protocol-relative URLs, auth routes, empties) falls back to the dashboard.
 */
export function sanitizeRedirect(raw: string | null | undefined): string {
	if (!raw) return DEFAULT_POST_LOGIN_TARGET;
	if (!raw.startsWith('/') || raw.startsWith('//')) return DEFAULT_POST_LOGIN_TARGET;
	if (raw === '/login' || raw.startsWith('/login?') || raw.startsWith('/login/')) {
		return DEFAULT_POST_LOGIN_TARGET;
	}
	return raw;
}

/** Screen feature: validate → login → redirect. Owns all login endpoint logic. */
export async function loginWithRedirect(
	email: string,
	password: string,
	navigate?: Navigator,
	target: string = DEFAULT_POST_LOGIN_TARGET
): Promise<LoginResult> {
	const parsed = LoginSchema.safeParse({ email, password });
	if (!parsed.success) {
		const flat = parsed.error.flatten().fieldErrors;
		return { ok: false, fieldErrors: { email: flat.email?.[0], password: flat.password?.[0] } };
	}
	try {
		await auth.login(parsed.data);
	} catch (err) {
		return { ok: false, error: mapLoginError(err as ApiErrorShape) };
	}
	const go: Navigator = navigate ?? (await import('$app/navigation')).goto;
	// No resolve() here: targets are dynamic post-login paths. Callers in .svelte
	// files keep using resolve() for their static routes.
	await go(sanitizeRedirect(target));
	return { ok: true };
}
