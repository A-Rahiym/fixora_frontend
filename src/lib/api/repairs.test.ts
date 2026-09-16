import { describe, expect, it } from 'vitest';
import { getRepairs } from '$lib/api/repairs';

describe('Phase 0 dummy fetch', () => {
	it('returns fixture repairs validated by Zod when backend is unreachable', async () => {
		const repairs = await getRepairs();
		expect(repairs.length).toBeGreaterThan(0);
		expect(repairs[0].jobNumber).toBe('FX-0001');
	});
});
