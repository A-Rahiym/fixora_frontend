<script lang="ts">
	import type { RecentJob } from '$lib/schemas/dashboard.schema';

	interface Props {
		jobs: RecentJob[];
	}

	let { jobs }: Props = $props();

	const TONES: Record<RecentJob['statusTone'], string> = {
		info: 'bg-indigo-50 text-indigo-600',
		warning: 'bg-amber-50 text-amber-700',
		success: 'bg-emerald-50 text-emerald-600',
		muted: 'bg-slate-100 text-slate-500'
	};

	const PRIORITY: Record<RecentJob['priority'], string> = {
		High: 'text-red-600',
		Medium: 'text-amber-600',
		Low: 'text-slate-500'
	};
</script>

<section
	class="rounded-xl border border-border bg-white p-5 shadow-sm"
	aria-label="Recent Repair Jobs"
>
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-base font-bold text-slate-900">Recent Repair Jobs</h2>
		<span class="text-xs text-slate-400" title="Full list lands with the Repairs phase"
			>View all</span
		>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm">
			<thead>
				<tr class="text-[11px] tracking-wider text-slate-400 uppercase">
					<th class="px-6 py-3 font-semibold">Job ID</th>
					<th class="px-6 py-3 font-semibold">Customer</th>
					<th class="px-6 py-3 font-semibold">Device &amp; Issue</th>
					<th class="px-6 py-3 font-semibold">Status</th>
					<th class="px-6 py-3 font-semibold">Priority</th>
					<th class="px-6 py-3 text-center font-semibold">Action</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each jobs as job (job.id)}
					<tr>
						<td class="px-6 py-3.5 font-semibold whitespace-nowrap text-brand-600"
							>{job.jobNumber}</td
						>
						<td class="px-6 py-3.5 whitespace-nowrap text-slate-700">{job.customer}</td>
						<td class="px-6 py-3.5 text-slate-700">{job.device} · {job.issue}</td>
						<td class="px-6 py-3.5">
							<span
								class="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap {TONES[
									job.statusTone
								]}"
							>
								{job.status}
							</span>
						</td>
						<td class="px-6 py-3.5 font-medium {PRIORITY[job.priority]}">{job.priority}</td>
						<td class="px-6 py-3.5 text-center">
							<span
								class="cursor-not-allowed text-xs font-semibold text-slate-300"
								title="Repair details land in Phase 3"
								aria-disabled="true"
							>
								View
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</section>
