import { env as publicEnv } from '$env/dynamic/public';

/** Typed access to public env vars. Falls back to sane Phase 0 defaults. */
export const API_BASE_URL: string =
	(publicEnv as Record<string, string | undefined>).PUBLIC_API_URL ?? 'http://localhost:8000/api';

export const APP_NAME = 'Fixora';
