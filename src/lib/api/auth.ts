import { z } from 'zod';
import { apiClient } from './client';
import {
	UserSchema,
	type ForgotInput,
	type LoginInput,
	type ResetInput,
	type SessionUser
} from '$lib/schemas/auth.schema';

const MessageSchema = z.object({ message: z.string() }).passthrough();

/** POST /api/v1/auth/login — returns the authenticated user. */
export async function login(input: LoginInput): Promise<SessionUser> {
	const json = await apiClient.post('/api/v1/auth/login', input);
	return UserSchema.passthrough().parse(json);
}

/** GET /api/v1/auth/me — current user or throws 401. */
export async function getMe(): Promise<SessionUser> {
	const json = await apiClient.get('/api/v1/auth/me');
	return UserSchema.passthrough().parse(json);
}

/** POST /api/v1/auth/logout */
export async function logout(): Promise<void> {
	try {
		await apiClient.post('/api/v1/auth/logout');
	} catch {
		// Logout is best-effort: session is cleared client-side regardless.
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
