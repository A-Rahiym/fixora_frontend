import { forgotPassword } from '$lib/api/auth';
import { ForgotSchema } from '$lib/schemas/auth.schema';
import type { ApiErrorShape } from '$lib/api/client';

export interface ForgotResult {
	sent: boolean;
	error?: string;
	fieldError?: string;
}

/** Screen feature: validate → request reset link. */
export async function requestResetLink(email: string): Promise<ForgotResult> {
	const parsed = ForgotSchema.safeParse({ email });
	if (!parsed.success) {
		return { sent: false, fieldError: parsed.error.flatten().fieldErrors.email?.[0] };
	}
	try {
		await forgotPassword(parsed.data);
		return { sent: true };
	} catch (err) {
		return {
			sent: false,
			error: (err as ApiErrorShape).message ?? 'Something went wrong. Try again.'
		};
	}
}
