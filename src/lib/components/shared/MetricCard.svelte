<script lang="ts">
	import type { Snippet } from 'svelte';

	export interface MetricTrend {
		direction: 'up' | 'down';
		text: string;
	}

	interface Props {
		label: string;
		value: string;
		caption?: string;
		trend?: MetricTrend;
		actionLabel?: string;
		actionHref?: string;
		icon?: Snippet;
	}

	let { label, value, caption, trend, actionLabel, actionHref, icon }: Props = $props();
</script>

<div class="flex flex-col justify-between rounded-xl border border-border bg-white p-4 shadow-sm">
	<div class="flex items-center justify-between">
		<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
			{#if icon}{@render icon()}{/if}
		</div>
		{#if trend}
			<span
				class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold {trend.direction ===
				'up'
					? 'bg-emerald-50 text-emerald-600'
					: 'bg-red-50 text-red-600'}"
			>
				{trend.direction === 'up' ? '↗' : '↘'}
				{trend.text}
			</span>
		{/if}
	</div>
	<div class="mt-3">
		<span class="text-[11px] font-bold tracking-wider text-slate-500 uppercase">{label}</span>
		<p class="tnum mt-0.5 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
		{#if caption}<p class="mt-0.5 text-[11px] text-slate-500">{caption}</p>{/if}
		{#if actionLabel && actionHref}
			<p class="mt-1">
				<!-- eslint-disable svelte/no-navigation-without-resolve -- actionHref arrives pre-resolved -->
				<a href={actionHref} class="text-xs font-semibold text-brand-600 hover:text-brand-700">
					{actionLabel}
				</a>
				<!-- eslint-enable svelte/no-navigation-without-resolve -->
			</p>
		{/if}
	</div>
</div>
