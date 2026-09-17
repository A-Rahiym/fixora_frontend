import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMe, login, logout } from '$lib/api/auth';
import { clearToken, getToken } from '$lib/api/session';
import { LoginResponseSchema, toSessionUser } from '$lib/schemas/auth.schema';

const LOGIN_PAYLOAD = {
	data: {
		token: '10|HjCn9kZpUoobIGmSreDL2EGh93ojTIIEoq496YZ5b8fd3ea5',
		user: {
			id: 1,
			name: 'Owner',
			email: 'owner@fixora.test',
			email_verified_at: '2026-09-13T22:08:03.000000Z',
			is_active: true,
			role: {
				id: 1,
				name: 'owner',
				label: 'Owner',
				permissions: ['repairs.view', 'repairs.create', 'inventory.view', 'payments.view']
			},
			created_at: '2026-09-13T22:08:03.000000Z',
			updated_at: '2026-09-13T22:08:03.000000Z'
		}
	},
	message: 'Logged in.'
};

function mockFetch(payload: unknown) {
	vi.stubGlobal(
		'fetch',
		vi.fn(async () => ({ ok: true, status: 200, json: async () => payload }))
	);
}

afterEach(() => {
	vi.unstubAllGlobals();
	clearToken();
});

describe('login contract', () => {
	it('parses the backend envelope and maps the user', () => {
		const parsed = LoginResponseSchema.parse(LOGIN_PAYLOAD);
		const user = toSessionUser(parsed.data.user);
		expect(user).toEqual({
			id: 1,
			name: 'Owner',
			email: 'owner@fixora.test',
			role: 'owner',
			isActive: true
		});
	});

	it('maps a null role to undefined', () => {
		const user = toSessionUser({ ...LOGIN_PAYLOAD.data.user, role: null });
		expect(user.role).toBeUndefined();
	});

	it('login() stores the bearer token and returns the session user', async () => {
		mockFetch(LOGIN_PAYLOAD);
		const user = await login({ email: 'owner@fixora.test', password: 'secret' });
		expect(user.email).toBe('owner@fixora.test');
		expect(getToken()).toBe('10|HjCn9kZpUoobIGmSreDL2EGh93ojTIIEoq496YZ5b8fd3ea5');
		const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0] as [
			string,
			RequestInit & { headers: Record<string, string> }
		];
		expect(options.body).toContain('owner@fixora.test');
	});

	it('getMe() accepts envelope, nested, and bare shapes', async () => {
		mockFetch({ data: LOGIN_PAYLOAD.data.user });
		expect((await getMe()).name).toBe('Owner');
		mockFetch({ data: { user: LOGIN_PAYLOAD.data.user } });
		expect((await getMe()).name).toBe('Owner');
		mockFetch(LOGIN_PAYLOAD.data.user);
		expect((await getMe()).name).toBe('Owner');
	});

	it('logout() clears the token even when the call fails', async () => {
		vi.stubGlobal(
			'fetch',
			vi.fn(async () => ({ ok: false, status: 500, statusText: 'Error', json: async () => ({}) }))
		);
		const { setToken } = await import('$lib/api/session');
		setToken('stale');
		await logout();
		expect(getToken()).toBeNull();
	});
});
