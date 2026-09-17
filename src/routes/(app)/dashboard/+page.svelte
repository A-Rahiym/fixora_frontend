<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { dashboardQueryOptions } from '$lib/features/dashboard/request';
	import MetricCard from '$lib/components/shared/MetricCard.svelte';
	import LoadingState from '$lib/components/shared/LoadingState.svelte';
	import ErrorState from '$lib/components/shared/ErrorState.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import RevenueChart from '$lib/features/dashboard/components/RevenueChart.svelte';
	import RecentJobsTable from '$lib/features/dashboard/components/RecentJobsTable.svelte';
	import AlertsList from '$lib/features/dashboard/components/AlertsList.svelte';
	import CapacityCard from '$lib/features/dashboard/components/CapacityCard.svelte';
	import DeviceMix from '$lib/features/dashboard/components/DeviceMix.svelte';

	const dashboard = createQuery(() => dashboardQueryOptions());

	// Demo affordance from the mock: preview the jobs empty state.
	let simulateEmpty = $state(false);

	const METRIC_ICONS: Record<string, string> = {
		'active-jobs':
			'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.6C.4 7 .9 10 2.9 12c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.3z',
		turnaround: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
		revenue:
			'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
		efficiency: 'M13 10V3L4 14h7v7l9-11h-7z'
	};
</script>

{#if dashboard.isPending}
	<LoadingState label="Loading workshop overview…" />
{:else if dashboard.isError}
	<ErrorState message="Could not load the workshop overview." onretry={() => dashboard.refetch()} />
{:else if dashboard.data}
	{@const data = dashboard.data}
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-bold tracking-tight text-slate-900">Workshop Overview</h1>
			<p class="mt-0.5 text-xs text-slate-500">
				Monitor real-time shop performance and pending repairs.
			</p>
		</div>
		<div class="flex items-center gap-2.5">
			<button
				class="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-surface-muted"
				title="Period selection lands with the Reports phase"
			>
				Select Period
			</button>
			<button
				onclick={() => (simulateEmpty = !simulateEmpty)}
				class="flex items-center gap-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-surface-muted"
				aria-pressed={simulateEmpty}
			>
				{simulateEmpty ? 'Show Jobs' : 'Simulate Empty'}
			</button>
			<button
				class="flex cursor-not-allowed items-center gap-1 rounded-lg bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white opacity-70 shadow"
				title="Job intake lands in Phase 3"
				aria-disabled="true"
			>
				<span class="mr-0.5 text-sm leading-none font-bold" aria-hidden="true">+</span>
				New Job Intake
			</button>
		</div>
	</div>

	<section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Metrics">
		{#each data.metrics as metric (metric.id)}
			<MetricCard
				label={metric.label}
				value={metric.value}
				caption={metric.caption}
				trend={metric.trend}
			>
				{#snippet icon()}
					<svg class="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
						<path d={METRIC_ICONS[metric.id] ?? METRIC_ICONS['active-jobs']}></path>
					</svg>
				{/snippet}
			</MetricCard>
		{/each}
	</section>

	<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
		<div class="space-y-6 lg:col-span-2">
			<RevenueChart
				points={data.revenue.points}
				currentTotal={data.revenue.currentTotal}
				previousTotal={data.revenue.previousTotal}
			/>
			{#if simulateEmpty}
				<EmptyState message="No repair jobs yet. New jobs will appear here once intake opens." />
			{:else}
				<RecentJobsTable jobs={data.recentJobs} />
			{/if}
		</div>
		<div class="space-y-6">
			<AlertsList alerts={data.alerts} />
			<CapacityCard utilizationPct={data.capacity.utilizationPct} entries={data.capacity.entries} />
			<DeviceMix entries={data.deviceMix} />
		</div>
	</div>
{/if}
