<script module lang="ts">
	import type { Snippet } from 'svelte';

	export interface DataColumn<T> {
		key: string;
		label: string;
		align?: 'left' | 'center' | 'right';
		/** Plain-text formatter (e.g. currency, dates). Escaped — never HTML. */
		render?(row: T): string;
		/** Rich cell (pills, links). Takes precedence over render. */
		cell?: Snippet<[T]>;
	}

	export interface Pagination {
		page: number;
		lastPage: number;
		total: number;
		perPage: number;
		onpage(page: number): void;
	}
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { isMobile } from '$lib/stores/breakpoint';

	interface Props {
		columns: DataColumn<T>[];
		rows: T[];
		keyOf(row: T): string | number;
		selectable?: boolean;
		selected?: (string | number)[];
		/** Page-level rich cells by column key. Takes precedence over column.cell. */
		cells?: Record<string, Snippet<[T]>>;
		pagination?: Pagination;
		testid?: string;
	}

	let {
		columns,
		rows,
		keyOf,
		selectable = false,
		selected = $bindable([]),
		cells,
		pagination,
		testid
	}: Props = $props();

	const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' } as const;

	const allSelected = $derived(rows.length > 0 && rows.every((r) => selected.includes(keyOf(r))));

	function toggleAll() {
		selected = allSelected ? [] : rows.map(keyOf);
	}

	function toggleRow(key: string | number) {
		selected = selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
	}

	function cellText(col: DataColumn<T>, row: T): string {
		if (col.render) return col.render(row);
		const v = row[col.key];
		return v === null || v === undefined ? '—' : String(v);
	}

	const resolved = $derived(columns.map((col) => ({ col, custom: cells?.[col.key] ?? col.cell })));
</script>

{#if $isMobile}
	<!-- Card list for small screens (guide §5): same columns, stacked. -->
	<ul class="space-y-3" data-testid={testid}>
		{#each rows as row (keyOf(row))}
			<li class="rounded-xl border border-border bg-white p-4 shadow-sm">
				{#if selectable}
					<label class="mb-2 flex items-center gap-2 text-xs text-slate-500">
						<input
							type="checkbox"
							checked={selected.includes(keyOf(row))}
							onchange={() => toggleRow(keyOf(row))}
							class="h-4 w-4 rounded border-gray-300"
						/>
						Select
					</label>
				{/if}
				<dl class="space-y-1.5">
					{#each resolved as { col, custom } (col.key)}
						<div class="flex items-baseline justify-between gap-3 text-sm">
							<dt
								class="shrink-0 text-[11px] font-semibold tracking-wider text-slate-400 uppercase"
							>
								{col.label}
							</dt>
							<dd class="text-right text-slate-700">
								{#if custom}{@render custom(row)}{:else}{cellText(col, row)}{/if}
							</dd>
						</div>
					{/each}
				</dl>
			</li>
		{/each}
	</ul>
{:else}
	<div class="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
		<table class="w-full text-left text-sm" data-testid={testid}>
			<thead>
				<tr class="text-[11px] tracking-wider text-slate-400 uppercase">
					{#if selectable}
						<th class="w-12 px-4 py-3 text-center">
							<input
								type="checkbox"
								checked={allSelected}
								onchange={toggleAll}
								aria-label="Select all rows"
								class="h-4 w-4 rounded border-gray-300"
							/>
						</th>
					{/if}
					{#each resolved as { col } (col.key)}
						<th class="px-4 py-3 font-semibold {alignClass[col.align ?? 'left']}">{col.label}</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each rows as row (keyOf(row))}
					<tr class="hover:bg-slate-50">
						{#if selectable}
							<td class="px-4 py-3.5 text-center">
								<input
									type="checkbox"
									checked={selected.includes(keyOf(row))}
									onchange={() => toggleRow(keyOf(row))}
									aria-label="Select row"
									class="h-4 w-4 rounded border-gray-300"
								/>
							</td>
						{/if}
						{#each resolved as { col, custom } (col.key)}
							<td class="px-4 py-3.5 text-slate-700 {alignClass[col.align ?? 'left']}">
								{#if custom}{@render custom(row)}{:else}{cellText(col, row)}{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

{#if pagination}
	<div class="mt-4 flex items-center justify-between text-xs text-slate-500">
		<p>
			Showing <span class="font-semibold text-slate-900">{rows.length}</span> of
			<span class="font-semibold text-slate-900">{pagination.total}</span>
		</p>
		<div class="flex items-center gap-2">
			<button
				onclick={() => pagination.onpage(pagination.page - 1)}
				disabled={pagination.page <= 1}
				class="rounded-lg border border-border bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:opacity-40"
			>
				Previous
			</button>
			<span class="tnum">Page {pagination.page} of {pagination.lastPage}</span>
			<button
				onclick={() => pagination.onpage(pagination.page + 1)}
				disabled={pagination.page >= pagination.lastPage}
				class="rounded-lg border border-border bg-white px-3 py-1.5 font-semibold text-slate-700 disabled:opacity-40"
			>
				Next
			</button>
		</div>
	</div>
{/if}
