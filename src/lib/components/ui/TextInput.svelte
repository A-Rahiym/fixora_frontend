<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		id: string;
		value?: string;
		type?: string;
		autocomplete?: HTMLInputAttributes['autocomplete'];
		placeholder?: string;
		invalid?: boolean;
		describedby?: string;
		ariaLabel?: string;
		icon?: Snippet;
	}

	let {
		id,
		value = $bindable(''),
		type = 'text',
		autocomplete,
		placeholder,
		invalid = false,
		describedby,
		ariaLabel,
		icon
	}: Props = $props();
</script>

{#if icon}
	<div class="relative">
		<div
			class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"
		>
			{@render icon()}
		</div>
		<input
			{id}
			{type}
			{autocomplete}
			{placeholder}
			bind:value
			aria-invalid={invalid}
			aria-describedby={describedby}
			aria-label={ariaLabel}
			class="block w-full rounded-lg border border-gray-300 bg-gray-50/50 py-2.5 pr-3.5 pl-10 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-indigo-600 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
		/>
	</div>
{:else}
	<input
		{id}
		{type}
		{autocomplete}
		{placeholder}
		bind:value
		aria-invalid={invalid}
		aria-describedby={describedby}
		aria-label={ariaLabel}
		class="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
	/>
{/if}
