import { describe, expect, it } from 'vitest';
import { loginWithRedirect, mapLoginError, sanitizeRedirect } from './request';

describe('login request', () => {
	it('returns field errors without touching the network', async () => {
		const result = await loginWithRedirect('not-an-email', '', () => {
			throw new Error('should not navigate');
		});
		expect(result.ok).toBe(false);
		expect(result.fieldErrors?.email).toBeTruthy();
	});

	it('maps auth errors to user-facing messages', () => {
		expect(mapLoginError({ status: 401, message: 'x' })).toBe('Invalid email or password.');
		expect(mapLoginError({ status: 403, message: 'x' })).toContain('disabled');
	});

	it('sanitizes post-login targets with dashboard fallback', () => {
		expect(sanitizeRedirect('/repairs/42')).toBe('/repairs/42');
		expect(sanitizeRedirect(null)).toBe('/dashboard');
		expect(sanitizeRedirect('')).toBe('/dashboard');
		expect(sanitizeRedirect('https://evil.test/x')).toBe('/dashboard');
		expect(sanitizeRedirect('//evil.test/x')).toBe('/dashboard');
		expect(sanitizeRedirect('/login')).toBe('/dashboard');
		expect(sanitizeRedirect('/login?redirect=/x')).toBe('/dashboard');
	});
});
