<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { auth } from '$lib/stores/auth';
	import { sidebarCollapsed } from '$lib/stores/ui';

	interface Props {
		/** In the mobile drawer the sidebar is always expanded. */
		forceExpanded?: boolean;
	}

	let { forceExpanded = false }: Props = $props();

	interface NavItem {
		label: string;
		href?: string;
		icon: string;
	}

	// Icons: outline SVGs per screens/dashboard.html (technicians icon is an analogue).
	const ICONS = {
		dashboard:
			'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
		jobs: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
		intake: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z',
		customers:
			'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
		inventory: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
		pos: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
		technicians:
			'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2',
		reports:
			'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
		settings:
			'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z'
	} as const;

	type IconName = keyof typeof ICONS;

	// Only Dashboard exists yet — the rest enable as their phases land (no dead links).
	const NAV: (NavItem & { iconName: IconName; match?: string })[] = [
		{
			label: 'Dashboard',
			href: resolve('/dashboard'),
			icon: ICONS.dashboard,
			iconName: 'dashboard',
			match: '/dashboard'
		},
		{ label: 'Jobs List', icon: ICONS.jobs, iconName: 'jobs' },
		{ label: 'New Job Intake', icon: ICONS.intake, iconName: 'intake' },
		{ label: 'Customers', icon: ICONS.customers, iconName: 'customers' },
		{ label: 'Inventory', icon: ICONS.inventory, iconName: 'inventory' },
		{ label: 'POS / Payments', icon: ICONS.pos, iconName: 'pos' },
		{ label: 'Technicians', icon: ICONS.technicians, iconName: 'technicians' },
		{ label: 'Reports', icon: ICONS.reports, iconName: 'reports' }
	];

	const rail = $derived(!forceExpanded && $sidebarCollapsed);
	const pathname = $derived(page.url.pathname);
	const isActive = (match?: string) => !!match && pathname.startsWith(match);

	let loggingOut = $state(false);

	function initials(name: string): string {
		return name
			.split(' ')
			.map((p) => p[0])
			.slice(0, 2)
			.join('')
			.toUpperCase();
	}

	async function handleLogout() {
		loggingOut = true;
		try {
			await auth.logout();
		} finally {
			loggingOut = false;
			await goto(resolve('/login'));
		}
	}
</script>

<aside
	class="flex shrink-0 flex-col justify-between border-r border-border bg-shell-sidebar select-none {rail
		? 'w-16'
		: 'w-64'}"
>
	<div>
		<div class="flex h-16 items-center space-x-3 px-6">
			<div
				class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-white shadow-sm"
			>
				<svg class="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
					<path
						d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.6C.4 7 .9 10 2.9 12c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.3z"
					></path>
				</svg>
			</div>
			{#if !rail}<span class="text-xl font-bold tracking-tight text-slate-900">Fixora</span>{/if}
		</div>

		<!-- eslint-disable svelte/no-navigation-without-resolve -- nav hrefs pre-resolved via resolve() -->
		<nav class="mt-4 space-y-1 px-3" aria-label="Primary">
			{#each NAV as item (item.label)}
				{@const active = isActive(item.match)}
				{#if item.href}
					<a
						href={item.href}
						aria-current={active ? 'page' : undefined}
						class="flex items-center space-x-3 rounded-lg px-3.5 py-2.5 font-medium transition-colors {active
							? 'bg-[#e2e6ee] text-slate-900'
							: 'text-slate-500 hover:bg-[#e2e6ee] hover:text-slate-900'}"
					>
						<svg
							class="h-5 w-5 shrink-0 {active ? 'text-slate-700' : ''}"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path d={item.icon} stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
						{#if !rail}<span class="text-[14px]">{item.label}</span>{/if}
					</a>
				{:else}
					<span
						class="flex cursor-not-allowed items-center space-x-3 rounded-lg px-3.5 py-2.5 font-medium text-slate-400 opacity-70"
						title="Available in a later phase"
						aria-disabled="true"
					>
						<svg
							class="h-5 w-5 shrink-0"
							fill="none"
							stroke="currentColor"
							stroke-width="1.8"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path d={item.icon} stroke-linecap="round" stroke-linejoin="round"></path>
						</svg>
						{#if !rail}<span class="text-[14px]">{item.label}</span>{/if}
					</span>
				{/if}
			{/each}
		</nav>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	</div>

	<div class="space-y-3 p-4">
		{#if !rail}
			<div class="flex items-center justify-between border-t border-[#d8dde6] pt-3">
				<div class="flex items-center space-x-3">
					<div
						class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white shadow-sm"
						aria-hidden="true"
					>
						{$auth ? initials($auth.name) : '–'}
					</div>
					<div class="leading-tight">
						<p class="text-xs font-semibold text-slate-900">{$auth?.name ?? '…'}</p>
						<p class="text-[11px] text-slate-500">{$auth?.role ?? 'Staff'}</p>
					</div>
				</div>
				<button
					onclick={handleLogout}
					disabled={loggingOut}
					class="p-1 text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-60"
					title="Log out"
					aria-label="Log out"
				>
					<svg
						class="h-5 w-5 rotate-180"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</button>
			</div>
		{:else}
			<div class="flex justify-center border-t border-[#d8dde6] pt-3">
				<button
					onclick={handleLogout}
					disabled={loggingOut}
					class="p-1 text-slate-400 transition-colors hover:text-slate-600 disabled:opacity-60"
					title="Log out"
					aria-label="Log out"
				>
					<svg
						class="h-5 w-5 rotate-180"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
					</svg>
				</button>
			</div>
		{/if}
	</div>
</aside>
