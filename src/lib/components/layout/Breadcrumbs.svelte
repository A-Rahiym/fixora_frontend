<script lang="ts">
	import { page } from '$app/state';

	interface Props {
		items?: string[];
	}

	let { items }: Props = $props();

	const LABELS: Record<string, string> = {
		dashboard: 'Dashboard',
		repairs: 'Repairs',
		customers: 'Customers',
		devices: 'Devices',
		inventory: 'Inventory',
		sales: 'Sales',
		payments: 'Payments',
		technicians: 'Technicians',
		suppliers: 'Suppliers',
		reports: 'Reports',
		settings: 'Settings'
	};

	const crumbs = $derived(
		items ?? [
			...(page.url.pathname
				.split('/')
				.filter(Boolean)
				.map((seg) => LABELS[seg] ?? seg.replace(/-/g, ' ')) || [])
		]
	);
</script>

<nav aria-label="Breadcrumb" class="flex items-center space-x-2 text-[13px] text-slate-500">
	{#each crumbs as crumb, i (crumb + i)}
		{#if i > 0}
			<svg
				class="h-3.5 w-3.5 text-slate-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
				></path>
			</svg>
		{/if}
		{#if i === crumbs.length - 1}
			<span class="font-medium text-slate-900" aria-current="page">{crumb}</span>
		{:else}
			<span>{crumb}</span>
		{/if}
	{/each}
</nav>
