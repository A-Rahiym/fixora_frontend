<script lang="ts">
	const { children } = $props();
</script>

<!-- Phase 1 will build AppShell/Sidebar/TopBar here (guide §Phase 1). Phase 0: passthrough. -->
<div data-testid="app-shell-placeholder">
	{@render children()}
</div>
