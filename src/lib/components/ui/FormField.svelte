<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		inputId: string;
		error?: string;
		hint?: string;
		aside?: Snippet;
		children: Snippet;
	}

	let { label, inputId, error, hint, aside, children }: Props = $props();
</script>

<div>
	<div class="mb-1.5 flex items-center justify-between">
		<label for={inputId} class="block text-xs font-semibold text-gray-700">{label}</label>
		{#if aside}{@render aside()}{/if}
	</div>
	{@render children()}
	{#if error}
		<p id="{inputId}-error" class="mt-1 text-xs text-red-600">{error}</p>
	{:else if hint}
		<p id="{inputId}-hint" class="mt-1 text-xs text-slate-500">{hint}</p>
	{/if}
</div>
