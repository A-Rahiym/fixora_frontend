<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		id: string;
		value?: string;
		type?: string;
		autocomplete?: HTMLInputAttributes['autocomplete'];
		placeholder?: string;
		invalid?: boolean;
		describedby?: string;
	}

	let {
		id,
		value = $bindable(''),
		type = 'text',
		autocomplete,
		placeholder,
		invalid = false,
		describedby
	}: Props = $props();
</script>

<input
	{id}
	{type}
	{autocomplete}
	{placeholder}
	bind:value
	aria-invalid={invalid}
	aria-describedby={describedby}
	class="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
/>
