<script lang="ts">
	import { getDashboardGreeting } from '$lib/features/dashboard/request';

	let greeting = $state('Shop overview lands here in Phase 9.');

	$effect(() => {
		getDashboardGreeting().then((g) => {
			greeting = g;
		});
	});
</script>

<div class="rounded-xl border border-border bg-surface p-8 shadow-sm">
	<h1 class="text-xl font-bold text-slate-900">Dashboard</h1>
	<p class="mt-1 text-sm text-slate-500">{greeting}</p>
</div>
