<script lang="ts">
	import { formatCurrency } from '$lib/utils/currency';
	import type { RevenuePoint } from '$lib/schemas/dashboard.schema';

	interface Props {
		points: RevenuePoint[];
		currentTotal: number;
		previousTotal: number;
	}

	let { points, currentTotal, previousTotal }: Props = $props();

	const W = 600;
	const H = 220;
	const PAD = 28;

	const max = $derived(Math.max(...points.flatMap((p) => [p.current, p.previous]), 1));

	function x(i: number): number {
		if (points.length === 1) return W / 2;
		return PAD + (i / (points.length - 1)) * (W - PAD * 2);
	}

	function y(v: number): number {
		return H - PAD - (v / max) * (H - PAD * 2);
	}

	function line(values: number[]): string {
		return values
			.map((v, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
			.join(' ');
	}

	const currentPath = $derived(line(points.map((p) => p.current)));
	const previousPath = $derived(line(points.map((p) => p.previous)));
	const areaPath = $derived(
		`${currentPath} L${x(points.length - 1).toFixed(1)},${(H - PAD).toFixed(1)} L${x(0).toFixed(1)},${(H - PAD).toFixed(1)} Z`
	);
</script>

<section
	class="rounded-xl border border-border bg-white p-5 shadow-sm"
	aria-label="Revenue Performance"
>
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-base font-bold text-slate-900">Revenue Performance</h2>
		<div class="flex items-center gap-4 text-[11px] text-slate-500">
			<span class="flex items-center gap-1.5">
				<span class="h-2 w-2 rounded-full bg-brand-500" aria-hidden="true"></span> This week
			</span>
			<span class="flex items-center gap-1.5">
				<span class="h-2 w-2 rounded-full bg-slate-300" aria-hidden="true"></span> Last week
			</span>
		</div>
	</div>

	<svg viewBox="0 0 {W} {H}" class="h-48 w-full" role="img" aria-label="Weekly revenue chart">
		<defs>
			<linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0%" stop-color="#5046e5" stop-opacity="0.25" />
				<stop offset="100%" stop-color="#5046e5" stop-opacity="0" />
			</linearGradient>
		</defs>
		<path d={areaPath} fill="url(#rev-fill)" />
		<path d={previousPath} fill="none" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="5 4" />
		<path d={currentPath} fill="none" stroke="#5046e5" stroke-width="2.5" stroke-linejoin="round" />
		{#each points as p, i (p.label)}
			<text x={x(i)} y={H - 8} text-anchor="middle" font-size="11" fill="#94a3b8">{p.label}</text>
		{/each}
	</svg>

	<div class="mt-3 flex items-center gap-6 border-t border-border pt-3 text-sm">
		<p class="text-slate-500">
			This week <span class="tnum font-bold text-slate-900"
				>{formatCurrency(currentTotal, 'USD')}</span
			>
		</p>
		<p class="text-slate-500">
			Last week <span class="tnum font-semibold text-slate-700"
				>{formatCurrency(previousTotal, 'USD')}</span
			>
		</p>
	</div>
</section>
