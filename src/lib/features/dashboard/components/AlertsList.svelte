<script lang="ts">
	import type { AlertItem } from '$lib/schemas/dashboard.schema';

	interface Props {
		alerts: AlertItem[];
	}

	let { alerts }: Props = $props();

	const SEVERITY: Record<AlertItem['severity'], { border: string; bg: string; icon: string }> = {
		critical: { border: 'border-[#fca5a5]', bg: 'bg-[#fffafb]', icon: 'text-red-500' },
		warning: { border: 'border-[#fed7aa]', bg: 'bg-[#fffcf9]', icon: 'text-amber-500' },
		info: { border: 'border-[#c7d2fe]', bg: 'bg-[#fafafe]', icon: 'text-brand-500' }
	};

	const ICON_PATH =
		'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z';
</script>

<section
	class="rounded-xl border border-border bg-white p-5 shadow-sm"
	aria-label="Operational Alerts"
>
	<div class="mb-4 flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<h2 class="text-base font-bold text-slate-900">Operational Alerts</h2>
			<span
				class="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white"
			>
				{alerts.length}
			</span>
		</div>
	</div>

	<div class="space-y-3">
		{#each alerts as alert (alert.id)}
			{@const tone = SEVERITY[alert.severity]}
			<div class="flex items-start space-x-2.5 rounded-lg border p-3 {tone.border} {tone.bg}">
				<svg
					class="mt-0.5 h-4 w-4 shrink-0 {tone.icon}"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path d={ICON_PATH} stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					></path>
				</svg>
				<div class="flex-1">
					<div class="flex items-center justify-between gap-2">
						<span class="text-xs font-semibold text-slate-900">{alert.title}</span>
						<span class="shrink-0 text-[10px] text-slate-400">{alert.timeAgo}</span>
					</div>
					<p class="mt-0.5 text-[11px] leading-snug text-slate-500">{alert.detail}</p>
				</div>
			</div>
		{/each}
	</div>
</section>
