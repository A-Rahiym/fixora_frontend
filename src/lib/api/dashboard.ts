import { apiClient } from './client';
import { DashboardDataSchema, type DashboardData } from '$lib/schemas/dashboard.schema';

/**
 * Phase 9 placeholder data, mirroring screens/dashboard.html until the
 * backend dashboard endpoints are live (implementation-guide.md §5).
 */
const FIXTURE: DashboardData = {
	metrics: [
		{
			id: 'active-jobs',
			label: 'Active Jobs',
			value: '42',
			caption: 'Current repairs in progress',
			trend: { direction: 'up', text: '+12%' }
		},
		{
			id: 'turnaround',
			label: 'Avg. Turnaround',
			value: '1.8d',
			caption: 'Average repair cycle',
			trend: { direction: 'up', text: '+1%' }
		},
		{ id: 'revenue', label: "Today's Revenue", value: '$12,450', caption: 'Collected today' },
		{ id: 'efficiency', label: 'Efficiency', value: '98%', caption: 'First-time fix rate' }
	],
	revenue: {
		currentTotal: 65950,
		previousTotal: 58200,
		points: [
			{ label: 'Mon', current: 8200, previous: 7400 },
			{ label: 'Tue', current: 9100, previous: 8300 },
			{ label: 'Wed', current: 7600, previous: 8100 },
			{ label: 'Thu', current: 10400, previous: 8900 },
			{ label: 'Fri', current: 12450, previous: 10200 },
			{ label: 'Sat', current: 9800, previous: 9100 },
			{ label: 'Sun', current: 8400, previous: 7000 }
		]
	},
	recentJobs: [
		{
			id: 8842,
			jobNumber: '#8842',
			customer: 'Michael Chen',
			device: 'Samsung S22 Ultra',
			issue: 'Screen Replacement',
			status: 'In Progress',
			statusTone: 'info',
			priority: 'High'
		},
		{
			id: 8841,
			jobNumber: '#8841',
			customer: 'Sarah Jenkins',
			device: 'iPhone 14 Pro',
			issue: 'Liquid Damage',
			status: 'Diagnosing',
			statusTone: 'warning',
			priority: 'High'
		},
		{
			id: 8840,
			jobNumber: '#8840',
			customer: 'Alice Walton',
			device: 'MacBook Pro',
			issue: 'Battery Service',
			status: 'Ready',
			statusTone: 'success',
			priority: 'Medium'
		},
		{
			id: 8839,
			jobNumber: '#8839',
			customer: 'John Doe',
			device: 'iPad Air',
			issue: 'Screen Replacement',
			status: 'Pending',
			statusTone: 'muted',
			priority: 'Low'
		}
	],
	alerts: [
		{
			id: 'low-stock-iphone13',
			severity: 'critical',
			title: 'iPhone 13 Pro Screens Low',
			detail: 'Stock level: 2 units. Reorder point triggered.',
			timeAgo: '10 mins ago'
		},
		{
			id: 'overdue-8842',
			severity: 'warning',
			title: 'Priority Job #8842 Overdue',
			detail: 'Samsung S22 Ultra repair exceeded 48h SLA.',
			timeAgo: '1 hour ago'
		},
		{
			id: 'capacity',
			severity: 'info',
			title: 'Staff Capacity Reached',
			detail: 'All technicians above 70% load. Consider rebalancing.',
			timeAgo: '3 hours ago'
		}
	],
	capacity: {
		utilizationPct: 85,
		entries: [
			{ technician: 'John Doe', role: 'Senior Technician', loadPct: 85, jobs: 12 },
			{ technician: 'Sarah Smith', role: 'Technician', loadPct: 72, jobs: 9 },
			{ technician: 'Michael Chen', role: 'Technician', loadPct: 64, jobs: 8 }
		]
	},
	deviceMix: [
		{ category: 'Smartphone', count: 27, pct: 64 },
		{ category: 'Laptop', count: 9, pct: 22 },
		{ category: 'Tablet', count: 6, pct: 14 }
	]
};

export async function getDashboardData(): Promise<DashboardData> {
	try {
		return await apiClient.get('/api/v1/dashboard/summary', DashboardDataSchema);
	} catch {
		return DashboardDataSchema.parse(FIXTURE);
	}
}
