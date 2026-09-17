<script lang="ts">
	import type { Snippet } from 'svelte';

	export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

	interface Props {
		variant?: ButtonVariant;
		type?: 'button' | 'submit' | 'reset';
		loading?: boolean;
		disabled?: boolean;
		onclick?: (e: MouseEvent) => void;
		icon?: Snippet;
		children: Snippet;
	}

	let {
		variant = 'primary',
		type = 'button',
		loading = false,
		disabled = false,
		onclick,
		icon,
		children
	}: Props = $props();

	const styles: Record<ButtonVariant, string> = {
		primary: 'bg-primary-600 text-white hover:bg-primary-700',
		secondary: 'border border-border bg-surface text-slate-700 hover:bg-slate-100',
		ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
		danger: 'bg-red-600 text-white hover:bg-red-700'
	};
</script>

<button
	{type}
	disabled={disabled || loading}
	{onclick}
	aria-busy={loading}
	class="inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-60 {styles[
		variant
	]}"
>
	{#if loading}
		<svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
		</svg>
	{/if}
	{#if icon}
		<span class="h-4 w-4" aria-hidden="true">{@render icon()}</span>
	{/if}
	{@render children()}
</button>
