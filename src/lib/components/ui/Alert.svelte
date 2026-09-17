<script lang="ts">
	import type { Snippet } from 'svelte';

	export type AlertVariant = 'error' | 'success' | 'warning' | 'info';

	interface Props {
		variant?: AlertVariant;
		message?: string;
		testid?: string;
		children?: Snippet;
	}

	let { variant = 'info', message, testid, children }: Props = $props();

	const role = $derived(variant === 'error' || variant === 'warning' ? 'alert' : 'status');

	const styles: Record<AlertVariant, string> = {
		error: 'bg-red-50 text-red-700',
		success: 'bg-green-50 text-green-800',
		warning: 'bg-amber-50 text-amber-800',
		info: 'bg-slate-100 text-slate-700'
	};
</script>

<div {role} data-testid={testid} class="rounded-lg p-3 text-sm {styles[variant]}">
	{#if message}{message}{/if}
	{#if children}{@render children()}{/if}
</div>
