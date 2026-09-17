import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import RevenueChart from './RevenueChart.svelte';
import RecentJobsTable from './RecentJobsTable.svelte';
import AlertsList from './AlertsList.svelte';
import CapacityCard from './CapacityCard.svelte';
import DeviceMix from './DeviceMix.svelte';
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

describe('AlertsList', () => {
	it('renders alerts with count badge', () => {
		const list = render(AlertsList, {
			props: {
				alerts: [
					{
						id: 'a1',
						severity: 'critical',
						title: 'Screens Low',
						detail: 'Stock level: 2 units.',
						timeAgo: '10 mins ago'
					}
				]
			}
		});
		expect(list.body).toContain('Operational Alerts');
		expect(list.body).toContain('Screens Low');
	});
});

describe('CapacityCard', () => {
	it('renders utilization and technician rows', () => {
		const card = render(CapacityCard, {
			props: {
				utilizationPct: 85,
				entries: [{ technician: 'John Doe', role: 'Senior Technician', loadPct: 85, jobs: 12 }]
			}
		});
		expect(card.body).toContain('85%');
		expect(card.body).toContain('John Doe');
	});
});

describe('DeviceMix', () => {
	it('renders category shares', () => {
		const mix = render(DeviceMix, {
			props: { entries: [{ category: 'Smartphone', count: 27, pct: 64 }] }
		});
		expect(mix.body).toContain('Smartphone');
		expect(mix.body).toContain('64%');
	});
});
