import { describe, expect, it } from 'vitest';
import { ForgotSchema, LoginSchema, ResetSchema } from './auth.schema';

describe('auth schemas', () => {
	it('rejects invalid login input', () => {
		expect(LoginSchema.safeParse({ email: 'not-an-email', password: '' }).success).toBe(false);
		expect(LoginSchema.safeParse({ email: 'tech@fixora.test', password: 'secret' }).success).toBe(
			true
		);
	});

	it('rejects invalid forgot input', () => {
		expect(ForgotSchema.safeParse({ email: 'bad' }).success).toBe(false);
	});

	it('rejects mismatched reset passwords and missing token', () => {
		expect(
			ResetSchema.safeParse({ token: '', password: 'password123', passwordConfirm: 'password123' })
				.success
		).toBe(false);
		expect(
			ResetSchema.safeParse({ token: 't', password: 'password123', passwordConfirm: 'other' })
				.success
		).toBe(false);
		expect(
			ResetSchema.safeParse({ token: 't', password: 'password123', passwordConfirm: 'password123' })
				.success
		).toBe(true);
	});
});
