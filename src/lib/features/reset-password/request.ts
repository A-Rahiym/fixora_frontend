import { resetPassword } from '$lib/api/auth';
import { ResetSchema } from '$lib/schemas/auth.schema';
import type { ApiErrorShape } from '$lib/api/client';

export interface ResetResult {
	ok: boolean;
	error?: string;
	fieldErrors?: { password?: string; passwordConfirm?: string };
}

/** Screen feature: validate token + passwords → reset. */
export async function resetWithToken(
	token: string,
	password: string,
	passwordConfirm: string
): Promise<ResetResult> {
	const parsed = ResetSchema.safeParse({ token, password, passwordConfirm });
	if (!parsed.success) {
		const flat = parsed.error.flatten().fieldErrors;
		const result: ResetResult = {
			ok: false,
			fieldErrors: { password: flat.password?.[0], passwordConfirm: flat.passwordConfirm?.[0] }
		};
		if (flat.token) result.error = flat.token[0];
		return result;
	}
	try {
		await resetPassword(parsed.data);
		return { ok: true };
	} catch (err) {
		return {
			ok: false,
			error: (err as ApiErrorShape).message ?? 'Reset failed. The link may have expired.'
		};
	}
}
