import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import RevenueChart from './RevenueChart.svelte';
import RecentJobsTable from './RecentJobsTable.svelte';
import type { RecentJob, RevenuePoint } from '$lib/schemas/dashboard.schema';

const points: RevenuePoint[] = [
	{ label: 'Mon', current: 100, previous: 80 },
	{ label: 'Tue', current: 120, previous: 90 }
];

const jobs: RecentJob[] = [
	{
		id: 1,
		jobNumber: '#8842',
		customer: 'Michael Chen',
		device: 'Samsung S22 Ultra',
		issue: 'Screen Replacement',
		status: 'In Progress',
		statusTone: 'info',
		priority: 'High'
	}
];

describe('RevenueChart', () => {
	it('renders chart with legend and exact totals', () => {
		const chart = render(RevenueChart, {
			props: { points, currentTotal: 220, previousTotal: 170 }
		});
		expect(chart.body).toContain('Revenue Performance');
		expect(chart.body).toContain('This week');
		expect(chart.body).toContain('220');
		expect(chart.body).toContain('<svg');
	});
});

describe('RecentJobsTable', () => {
	it('renders job rows with status and priority', () => {
		const table = render(RecentJobsTable, { props: { jobs } });
		expect(table.body).toContain('#8842');
		expect(table.body).toContain('Michael Chen');
		expect(table.body).toContain('In Progress');
		expect(table.body).toContain('High');
	});
});
