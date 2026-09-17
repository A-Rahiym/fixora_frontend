import { z } from 'zod';
import { apiClient } from './client';
import { clearToken, setToken } from './session';
import {
	LoginResponseSchema,
	UserResourceSchema,
	toSessionUser,
	type ForgotInput,
	type LoginInput,
	type ResetInput,
	type SessionUser
} from '$lib/schemas/auth.schema';

const MessageSchema = z.object({ message: z.string() }).passthrough();

/** POST /api/v1/auth/login — stores the bearer token, returns the session user. */
export async function login(input: LoginInput): Promise<SessionUser> {
	const json = await apiClient.post('/api/v1/auth/login', input);
	console.log('login response', json);
	const parsed = LoginResponseSchema.parse(json);
	setToken(parsed.data.token);
	return toSessionUser(parsed.data.user);
}

/** GET /api/v1/auth/me — current user or throws 401. Accepts envelope, nested, or bare shapes. */
export async function getMe(): Promise<SessionUser> {
	const json: unknown = await apiClient.get('/api/v1/auth/me');
	let candidate = json;
	if (candidate && typeof candidate === 'object' && 'data' in candidate) {
		const data = (candidate as { data: unknown }).data;
		candidate =
			data && typeof data === 'object' && 'user' in data
				? (data as { user: unknown }).user
				: data;
	}
	return toSessionUser(UserResourceSchema.parse(candidate));
}

/** POST /api/v1/auth/logout — token cleared client-side regardless. */
export async function logout(): Promise<void> {
	try {
		await apiClient.post('/api/v1/auth/logout');
	} catch {
		// Logout is best-effort: session is cleared client-side regardless.
	} finally {
		clearToken();
	}
}

/** POST /api/v1/auth/forgot-password */
export async function forgotPassword(input: ForgotInput): Promise<string> {
	const json = await apiClient.post('/api/v1/auth/forgot-password', input, MessageSchema);
	return json.message;
}

/** POST /api/v1/auth/reset-password */
export async function resetPassword(input: ResetInput): Promise<string> {
	const json = await apiClient.post(
		'/api/v1/auth/reset-password',
		{ token: input.token, password: input.password, password_confirmation: input.passwordConfirm },
		MessageSchema
	);
	return json.message;
}
