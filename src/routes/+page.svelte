<script lang="ts">
	import { getRepairs } from '$lib/api/repairs';
	import { formatCurrency } from '$lib/utils/currency';
	import { REPAIR_STATUS_LABELS } from '$lib/constants/statuses';

	let status = $state('booting…');

	$effect(() => {
		getRepairs()
			.then((r) => {
				status = `dummy fetch ok — ${r.length} repair(s), first: ${r[0]?.jobNumber} (${REPAIR_STATUS_LABELS[r[0].status]}) · ${formatCurrency(r[0]?.finalCost)}`;
			})
			.catch((e) => {
				status = `dummy fetch failed: ${String(e)}`;
			});
	});
</script>

<div class="mx-auto max-w-2xl space-y-6 p-8">
	<h1 class="text-2xl font-bold text-slate-900">Fixora — Phase 0 boot check</h1>
	<p class="text-slate-600">
		Blank app boots, Tailwind tokens render, dummy authenticated fetch runs.
	</p>

	<div class="grid grid-cols-3 gap-4">
		<div class="rounded-lg bg-primary-500 p-4 text-white">primary-500 token</div>
		<div class="rounded-lg border border-slate-200 bg-white p-4">
			<p class="text-sm text-slate-500">surface token</p>
			<p class="tnum font-mono">K1,250.00</p>
		</div>
		<div class="rounded-lg bg-status-ready p-4 text-white">status-ready token</div>
	</div>

	<p data-testid="phase0-status" class="rounded bg-slate-100 p-3 font-mono text-sm">{status}</p>
</div>
