<script lang="ts">
	import AppShell from '$lib/components/layout/AppShell.svelte';

	const { children } = $props();
</script>

<AppShell>
	{@render children()}
</AppShell>
