import { z } from 'zod';
import { API_BASE_URL } from '$lib/config/env';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiErrorShape {
	status: number;
	message: string;
	errors?: Record<string, string[]>;
}

const ApiErrorSchema = z.object({
	status: z.number(),
	message: z.string(),
	errors: z.record(z.string(), z.array(z.string())).optional()
});

async function request<T>(
	path: string,
	options: RequestInit = {},
	schema?: z.ZodType<T>
): Promise<T> {
	const res = await fetch(`${API_BASE_URL}${path}`, {
		credentials: 'include',
		headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
		...options
	});

	if (res.status === 401 && typeof window !== 'undefined') {
		const { clearSession } = await import('$lib/stores/auth');
		clearSession();
		window.location.href = '/login';
		throw { status: 401, message: 'Unauthenticated' } satisfies ApiErrorShape;
	}

	const json: unknown = await res.json().catch(() => null);

	if (!res.ok) {
		const parsed = ApiErrorSchema.safeParse({ ...(json as object), status: res.status });
		throw (
			parsed.success ? parsed.data : { status: res.status, message: res.statusText }
		) as ApiErrorShape;
	}

	if (schema) return schema.parse(json);
	return json as T;
}

export const apiClient = {
	get: <T>(path: string, schema?: z.ZodType<T>) => request<T>(path, { method: 'GET' }, schema),
	post: <T>(path: string, body?: unknown, schema?: z.ZodType<T>) =>
		request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }, schema),
	put: <T>(path: string, body?: unknown, schema?: z.ZodType<T>) =>
		request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }, schema),
	patch: <T>(path: string, body?: unknown, schema?: z.ZodType<T>) =>
		request<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }, schema),
	del: <T>(path: string, schema?: z.ZodType<T>) => request<T>(path, { method: 'DELETE' }, schema)
};
