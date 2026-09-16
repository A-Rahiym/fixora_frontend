<script lang="ts">
	const { children } = $props();
</script>

<div class="flex min-h-screen items-center justify-center bg-surface-muted">
	{@render children()}
</div>
