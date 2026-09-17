<script lang="ts">
	import type { DeviceMixEntry } from '$lib/schemas/dashboard.schema';

	interface Props {
		entries: DeviceMixEntry[];
	}

	let { entries }: Props = $props();

	const BARS = ['bg-brand-500', 'bg-indigo-300', 'bg-slate-300'];
</script>

<section class="rounded-xl border border-border bg-white p-5 shadow-sm" aria-label="Device Mix">
	<h2 class="mb-4 text-base font-bold text-slate-900">Device Mix</h2>

	<ul class="space-y-3">
		{#each entries as entry, i (entry.category)}
			<li>
				<div class="flex items-center justify-between text-xs">
					<span class="font-semibold text-slate-900">{entry.category}</span>
					<span class="tnum text-slate-500">{entry.count} · {entry.pct}%</span>
				</div>
				<div class="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
					<div
						class="h-full rounded-full {BARS[i % BARS.length]}"
						style="width: {entry.pct}%"
					></div>
				</div>
			</li>
		{/each}
	</ul>
</section>
