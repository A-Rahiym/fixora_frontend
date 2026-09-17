<script lang="ts">
	const { children } = $props();
</script>

<!-- Neutral frame: each (auth) page owns its own layout (login split-screen, centered cards). -->
<div class="min-h-screen">
	{@render children()}
</div>
