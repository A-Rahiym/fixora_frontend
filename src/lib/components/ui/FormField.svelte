<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		inputId: string;
		error?: string;
		hint?: string;
		children: Snippet;
	}

	let { label, inputId, error, hint, children }: Props = $props();
</script>

<div>
	<label for={inputId} class="mb-1 block text-sm font-medium text-slate-700">{label}</label>
	{@render children()}
	{#if error}
		<p id="{inputId}-error" class="mt-1 text-xs text-red-600">{error}</p>
	{:else if hint}
		<p id="{inputId}-hint" class="mt-1 text-xs text-slate-500">{hint}</p>
	{/if}
</div>
