import { describe, expect, it } from 'vitest';
import { getDashboardData } from '$lib/api/dashboard';

describe('dashboard data layer', () => {
	it('returns fixture data validated by Zod when backend is unreachable', async () => {
		const data = await getDashboardData();
		expect(data.metrics.length).toBe(4);
		expect(data.recentJobs[0].jobNumber).toBe('#8842');
		expect(data.alerts.length).toBe(3);
		expect(data.revenue.points.length).toBe(7);
	});
});
