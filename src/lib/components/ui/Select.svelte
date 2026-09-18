<script lang="ts">
	export interface SelectOption {
		value: string;
		label: string;
	}

	interface Props {
		id: string;
		value?: string;
		options: SelectOption[];
		invalid?: boolean;
		describedby?: string;
		ariaLabel?: string;
	}

	let {
		id,
		value = $bindable(''),
		options,
		invalid = false,
		describedby,
		ariaLabel
	}: Props = $props();
</script>

<select
	{id}
	bind:value
	aria-invalid={invalid}
	aria-describedby={describedby}
	aria-label={ariaLabel}
	class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
>
	{#each options as opt (opt.value)}
		<option value={opt.value}>{opt.label}</option>
	{/each}
</select>
