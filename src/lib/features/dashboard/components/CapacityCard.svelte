<script lang="ts">
	import type { CapacityEntry } from '$lib/schemas/dashboard.schema';

	interface Props {
		utilizationPct: number;
		entries: CapacityEntry[];
	}

	let { utilizationPct, entries }: Props = $props();
</script>

<section
	class="rounded-xl border border-border bg-white p-5 shadow-sm"
	aria-label="Capacity and Efficiency"
>
	<h2 class="mb-4 text-base font-bold text-slate-900">Capacity &amp; Efficiency</h2>

	<div class="mb-4">
		<div class="flex items-baseline justify-between">
			<span class="tnum text-2xl font-bold text-slate-900">{utilizationPct}%</span>
			<span class="text-[11px] text-slate-500">shop utilization</span>
		</div>
		<div
			class="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
			role="progressbar"
			aria-valuenow={utilizationPct}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label="Shop utilization"
		>
			<div class="h-full rounded-full bg-brand-500" style="width: {utilizationPct}%"></div>
		</div>
	</div>

	<ul class="space-y-3">
		{#each entries as entry (entry.technician)}
			<li>
				<div class="flex items-center justify-between text-xs">
					<span class="font-semibold text-slate-900">{entry.technician}</span>
					<span class="tnum text-slate-500">{entry.jobs} jobs · {entry.loadPct}%</span>
				</div>
				<p class="text-[11px] text-slate-400">{entry.role}</p>
				<div class="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
					<div
						class="h-full rounded-full {entry.loadPct >= 80 ? 'bg-red-500' : 'bg-emerald-500'}"
						style="width: {entry.loadPct}%"
					></div>
				</div>
			</li>
		{/each}
	</ul>
</section>
