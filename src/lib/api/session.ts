/**
 * In-memory bearer token holder. Deliberately *not* persisted to
 * localStorage/sessionStorage (XSS trade-off) — persistence arrives
 * with the remember-me slice. Session rehydrates via GET /me while
 * the backend cookie/token is still valid.
 */
let token: string | null = null;

export function setToken(value: string): void {
	token = value;
}

export function getToken(): string | null {
	return token;
}

export function clearToken(): void {
	token = null;
}
