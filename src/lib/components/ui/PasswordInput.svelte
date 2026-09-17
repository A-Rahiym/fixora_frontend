<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import TextInput from './TextInput.svelte';

	interface Props {
		id?: string;
		value?: string;
		autocomplete?: HTMLInputAttributes['autocomplete'];
		invalid?: boolean;
		describedby?: string;
	}

	let {
		id = 'password',
		value = $bindable(''),
		autocomplete = 'current-password',
		invalid = false,
		describedby
	}: Props = $props();

	let show = $state(false);
</script>

<div class="relative [&_input]:pr-16">
	<TextInput
		{id}
		type={show ? 'text' : 'password'}
		{autocomplete}
		{invalid}
		{describedby}
		bind:value
	/>
	<button
		type="button"
		onclick={() => (show = !show)}
		class="absolute top-1/2 right-2 -translate-y-1/2 rounded px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
	>
		{show ? 'Hide' : 'Show'}
	</button>
</div>
