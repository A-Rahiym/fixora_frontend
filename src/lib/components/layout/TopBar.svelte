<script lang="ts">
	import { auth } from '$lib/stores/auth';
	import { formatDate } from '$lib/utils/dates';
	import Breadcrumbs from './Breadcrumbs.svelte';

	interface Props {
		/** Opens the mobile navigation drawer. */
		onmenu?: () => void;
	}

	let { onmenu }: Props = $props();

	const today = formatDate(new Date().toISOString());

	function initials(name: string): string {
		return name
			.split(' ')
			.map((p) => p[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	}
</script>

<header
	class="flex h-16 shrink-0 items-center justify-between border-b border-border bg-white px-4 md:px-8"
>
	<div class="flex items-center gap-3">
		{#if onmenu}
			<button
				onclick={onmenu}
				class="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
				aria-label="Open navigation"
			>
				<svg
					class="h-5 w-5"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round"></path>
				</svg>
			</button>
		{/if}
		<Breadcrumbs />
	</div>

	<div class="flex items-center space-x-3.5">
		<div class="relative hidden w-64 sm:block">
			<svg
				class="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
				></path>
			</svg>
			<input
				class="w-full rounded-lg border border-border bg-surface-muted py-2 pr-8 pl-9 text-xs text-slate-700 transition placeholder:text-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
				placeholder="Search jobs, customers, parts…"
				type="text"
				aria-label="Search (available in a later phase)"
				title="Global search lands in Phase 10"
			/>
			<span
				class="absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-slate-300 px-1.5 py-0.5 font-mono text-[10px] text-slate-400"
				aria-hidden="true"
			>
				⌘K
			</span>
		</div>

		<div
			class="hidden cursor-default items-center space-x-1.5 rounded-lg border border-border bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm md:flex"
		>
			<svg
				class="h-4 w-4 text-slate-500"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.8"
				></path>
			</svg>
			<span>{today}</span>
		</div>

		<button
			class="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
			aria-label="Notifications (available in a later phase)"
			title="Notifications land in Phase 10"
		>
			<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
				<path
					d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="1.8"
				></path>
			</svg>
			<span
				class="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"
				aria-hidden="true"
			></span>
		</button>

		<div
			class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white"
			title={$auth?.name ?? 'Account'}
			aria-hidden="true"
		>
			{$auth ? initials($auth.name) : '–'}
		</div>
	</div>
</header>
