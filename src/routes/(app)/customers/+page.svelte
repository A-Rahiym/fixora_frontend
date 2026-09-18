<script lang="ts">
	import { untrack } from 'svelte';
	import { resolve } from '$app/paths';
	import { goto } from '$app/navigation';
	import { createQuery } from '@tanstack/svelte-query';
	import { customersQueryOptions } from '$lib/features/customers/list/request';
	import type { Customer } from '$lib/schemas/customer.schema';
	import { formatDate } from '$lib/utils/dates';
	import DataTable, { type DataColumn } from '$lib/components/ui/DataTable.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import LoadingState from '$lib/components/shared/LoadingState.svelte';
	import ErrorState from '$lib/components/shared/ErrorState.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';

	let search = $state('');
	let sort = $state('newest');
	let page = $state(1);
	let selected = $state<(string | number)[]>([]);

	const filters = $derived({
		search: search.trim() || undefined,
		sort: (sort || 'newest') as 'newest' | 'oldest' | 'name',
		page,
		perPage: 15
	});

	const customers = createQuery(() => customersQueryOptions(filters));

	$effect(() => {
		void search;
		void sort;
		untrack(() => {
			page = 1;
		});
	});

	const columns: DataColumn<Customer>[] = [
		{ key: 'name', label: 'Name' },
		{ key: 'phone', label: 'Contact' },
		{ key: 'devicesCount', label: 'Devices', align: 'center' },
		{ key: 'createdAt', label: 'Member Since' },
		{ key: 'action', label: 'Action', align: 'center' }
	];
</script>

<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
	<div>
		<h1 class="text-2xl font-bold tracking-tight text-slate-900">Customers</h1>
		<p class="mt-0.5 text-xs text-slate-500">Manage shop customers and their devices.</p>
	</div>
	<button
		onclick={() => goto(resolve('/customers/new'))}
		class="flex items-center gap-1 self-start rounded-lg bg-brand-500 px-3.5 py-2 text-xs font-semibold text-white shadow transition hover:bg-brand-600"
	>
		<span class="mr-0.5 text-sm leading-none font-bold" aria-hidden="true">+</span>
		New Customer
	</button>
</div>

<div class="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 shadow-sm sm:flex-row">
	<div class="flex-1">
		<TextInput
			id="customer-search"
			placeholder="Search by name, phone, or code…"
			bind:value={search}
			ariaLabel="Search customers"
		>
			{#snippet icon()}
				<svg
					class="h-4 w-4"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						stroke-linecap="round"
						stroke-linejoin="round"
					></path>
				</svg>
			{/snippet}
		</TextInput>
	</div>
	<Select
		id="customer-sort"
		bind:value={sort}
		ariaLabel="Sort customers"
		options={[
			{ value: 'newest', label: 'Most Recent' },
			{ value: 'oldest', label: 'Oldest First' },
			{ value: 'name', label: 'Name A–Z' }
		]}
	/>
</div>

{#if customers.isPending}
	<LoadingState label="Loading customers…" />
{:else if customers.isError}
	<ErrorState message="Could not load customers." onretry={() => customers.refetch()} />
{:else if customers.data}
	{@const result = customers.data}
	{#if result.data.length === 0}
		<EmptyState
			message="No customers found. Add your first customer to get started."
			actionLabel="New Customer"
			actionHref={resolve('/customers/new')}
		/>
	{:else}
		<DataTable
			{columns}
			rows={result.data}
			keyOf={(r) => r.id}
			selectable
			bind:selected
			cells={{
				name: customerName,
				phone: customerContact,
				devicesCount: deviceCount,
				createdAt: memberSince,
				action: viewAction
			}}
			pagination={{
				page: result.page,
				lastPage: result.lastPage,
				total: result.total,
				perPage: result.perPage,
				onpage: (p) => (page = p)
			}}
			testid="customers-table"
		/>
	{/if}
{/if}

{#snippet customerName(row: Customer)}
	<button
		onclick={() => goto(resolve(`/customers/${row.id}`))}
		class="font-semibold whitespace-nowrap text-brand-600 hover:text-brand-700"
	>
		{row.name}
	</button>
{/snippet}

{#snippet customerContact(row: Customer)}
	<span class="whitespace-nowrap">{row.phone}</span>
	{#if row.email}
		<span class="block text-[11px] text-slate-400">{row.email}</span>
	{/if}
{/snippet}

{#snippet deviceCount(row: Customer)}
	<span class="tnum">{row.devicesCount} {row.devicesCount === 1 ? 'device' : 'devices'}</span>
{/snippet}

{#snippet memberSince(row: Customer)}
	<span class="whitespace-nowrap">{formatDate(row.createdAt)}</span>
{/snippet}

{#snippet viewAction(row: Customer)}
	<button
		onclick={() => goto(resolve(`/customers/${row.id}`))}
		class="text-xs font-semibold text-brand-600 hover:text-brand-700"
	>
		View
	</button>
{/snippet}
