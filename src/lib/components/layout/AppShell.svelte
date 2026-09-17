<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/state';
	import { sidebarCollapsed } from '$lib/stores/ui';
	import Sidebar from './Sidebar.svelte';
	import TopBar from './TopBar.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let drawerOpen = $state(false);

	// Close the mobile drawer on navigation.
	$effect(() => {
		void page.url.pathname;
		drawerOpen = false;
	});

	function toggleCollapse() {
		sidebarCollapsed.update((v) => !v);
	}
</script>

<div class="flex min-h-screen w-full bg-surface-muted">
	<!-- Desktop / tablet sidebar: icon rail on md, full (collapsible) on lg+ -->
	<div class="hidden md:block">
		<div class="sticky top-0 flex h-screen flex-col">
			<Sidebar />
			<button
				onclick={toggleCollapse}
				class="border-t border-border bg-shell-sidebar px-3 py-2 text-[11px] font-medium text-slate-500 hover:text-slate-900"
				aria-expanded={!$sidebarCollapsed}
				aria-label={$sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
			>
				{$sidebarCollapsed ? '»' : '«'}
			</button>
		</div>
	</div>

	<!-- Mobile drawer -->
	{#if drawerOpen}
		<div
			class="fixed inset-0 z-40 md:hidden"
			role="dialog"
			aria-modal="true"
			aria-label="Navigation"
		>
			<button
				class="absolute inset-0 bg-slate-900/50"
				onclick={() => (drawerOpen = false)}
				aria-label="Close navigation"
			></button>
			<div class="absolute inset-y-0 left-0 flex">
				<Sidebar forceExpanded />
			</div>
		</div>
	{/if}

	<div class="flex min-w-0 flex-1 flex-col">
		<TopBar onmenu={() => (drawerOpen = true)} />
		<main class="mx-auto w-full max-w-[1400px] flex-1 space-y-6 p-4 md:p-8" data-testid="app-shell">
			{@render children()}
		</main>
	</div>
</div>
