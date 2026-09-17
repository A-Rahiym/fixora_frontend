<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { auth } from '$lib/stores/auth';

	const { children } = $props();

	let loggingOut = $state(false);

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

<!-- Interim shell: replaced by AppShell/Sidebar/TopBar in the shell slice. -->
<div data-testid="app-shell-placeholder" class="min-h-screen bg-surface-muted">
	<header class="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
		<p class="font-bold text-slate-900">Fixora</p>
		<button
			onclick={handleLogout}
			disabled={loggingOut}
			class="rounded-lg border border-border px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:opacity-60"
		>
			{loggingOut ? 'Logging out…' : 'Log out'}
		</button>
	</header>
	<main class="mx-auto max-w-5xl p-4">
		{@render children()}
	</main>
</div>
