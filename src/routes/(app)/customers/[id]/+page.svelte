<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { createQuery, useQueryClient } from '@tanstack/svelte-query';
	import {
		customerQueryOptions,
		removeCustomer,
		saveCustomer
	} from '$lib/features/customers/detail/request';
	import type { UpdateCustomerInput } from '$lib/schemas/customer.schema';
	import { formatDate } from '$lib/utils/dates';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import LoadingState from '$lib/components/shared/LoadingState.svelte';
	import ErrorState from '$lib/components/shared/ErrorState.svelte';
	import EmptyState from '$lib/components/shared/EmptyState.svelte';
	import DataTable, { type DataColumn } from '$lib/components/ui/DataTable.svelte';
	import type { Device } from '$lib/schemas/device.schema';

	const queryClient = useQueryClient();
	const id = $derived(Number(page.params.id));

	const detail = createQuery(() => customerQueryOptions(id));

	type Tab = 'devices' | 'repairs' | 'history' | 'notes';
	let tab = $state<Tab>('devices');
	let editing = $state(false);
	let confirmingDelete = $state(false);
	let busy = $state(false);
	let error = $state<string | null>(null);

	let form = $state({ name: '', phone: '', whatsappPhone: '', email: '', address: '', notes: '' });

	function startEdit(
		name: string,
		phone: string,
		whatsapp: string | null,
		email: string | null,
		address: string | null,
		notes: string | null
	) {
		form = {
			name,
			phone,
			whatsappPhone: whatsapp ?? '',
			email: email ?? '',
			address: address ?? '',
			notes: notes ?? ''
		};
		error = null;
		editing = true;
	}

	async function handleSave(e: SubmitEvent) {
		e.preventDefault();
		busy = true;
		error = null;
		try {
			const input: UpdateCustomerInput = {
				name: form.name,
				phone: form.phone,
				whatsapp_phone: form.whatsappPhone || null,
				email: form.email || null,
				address: form.address || null,
				notes: form.notes || null
			};
			await saveCustomer(queryClient, id, input);
			editing = false;
		} catch (err) {
			error =
				err && typeof err === 'object' && 'message' in err
					? String((err as { message: unknown }).message)
					: 'Could not save changes.';
		} finally {
			busy = false;
		}
	}

	async function handleDelete() {
		if (!confirmingDelete) {
			confirmingDelete = true;
			return;
		}
		busy = true;
		error = null;
		try {
			await removeCustomer(queryClient, id);
			await goto(resolve('/customers'));
		} catch (err) {
			error =
				err && typeof err === 'object' && 'message' in err
					? String((err as { message: unknown }).message)
					: 'Could not delete this customer.';
			confirmingDelete = false;
		} finally {
			busy = false;
		}
	}

	const deviceColumns: DataColumn<Device>[] = [
		{ key: 'device', label: 'Device' },
		{ key: 'serial', label: 'Serial / IMEI' },
		{ key: 'color', label: 'Color' },
		{ key: 'createdAt', label: 'Added' }
	];

	const TABS: { id: Tab; label: string }[] = [
		{ id: 'devices', label: 'Devices' },
		{ id: 'repairs', label: 'Repairs' },
		{ id: 'history', label: 'History' },
		{ id: 'notes', label: 'Notes' }
	];
</script>

{#if detail.isPending}
	<LoadingState label="Loading customer…" />
{:else if detail.isError}
	<ErrorState message="Could not load this customer." onretry={() => detail.refetch()} />
{:else if detail.data}
	{@const customer = detail.data.customer}
	{@const devices = detail.data.devices}

	<section
		class="flex items-center justify-between border-b border-border bg-white px-4 py-5 md:px-8"
	>
		<div class="flex items-center gap-4">
			<button
				onclick={() => goto(resolve('/customers'))}
				class="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
				aria-label="Back to customers"
			>
				<svg
					class="h-4 w-4"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
					></path>
				</svg>
			</button>
			<div>
				<div class="flex items-center gap-3">
					<h1 class="text-xl font-bold tracking-tight text-slate-900">{customer.name}</h1>
				</div>
				<p class="mt-0.5 font-mono text-xs tracking-wider text-slate-400">{customer.phone}</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			{#if !editing}
				<button
					onclick={() =>
						startEdit(
							customer.name,
							customer.phone,
							customer.whatsappPhone,
							customer.email,
							customer.address,
							customer.notes
						)}
					class="rounded-lg border border-border bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-surface-muted"
				>
					Edit
				</button>
			{/if}
			<button
				onclick={handleDelete}
				disabled={busy}
				class="rounded-lg border px-3 py-2 text-xs font-semibold shadow-sm disabled:opacity-60 {confirmingDelete
					? 'border-red-200 bg-red-600 text-white hover:bg-red-700'
					: 'border-border bg-white text-red-600 hover:bg-red-50'}"
			>
				{confirmingDelete ? 'Confirm Delete' : 'Delete'}
			</button>
		</div>
	</section>

	{#if error}
		<div class="px-4 pt-4 md:px-8">
			<Alert variant="error" message={error} />
		</div>
	{/if}

	{#if editing}
		<div class="mx-auto w-full max-w-2xl rounded-xl border border-border bg-white p-6 shadow-sm">
			<form onsubmit={handleSave} class="space-y-4" novalidate>
				<FormField label="Full Name" inputId="edit-name">
					<TextInput id="edit-name" bind:value={form.name} />
				</FormField>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<FormField label="Phone" inputId="edit-phone">
						<TextInput id="edit-phone" type="tel" bind:value={form.phone} />
					</FormField>
					<FormField label="WhatsApp" inputId="edit-whatsapp">
						<TextInput id="edit-whatsapp" type="tel" bind:value={form.whatsappPhone} />
					</FormField>
				</div>
				<FormField label="Email" inputId="edit-email">
					<TextInput id="edit-email" type="email" bind:value={form.email} />
				</FormField>
				<FormField label="Address" inputId="edit-address">
					<TextInput id="edit-address" bind:value={form.address} />
				</FormField>
				<FormField label="Notes" inputId="edit-notes">
					<TextInput id="edit-notes" bind:value={form.notes} />
				</FormField>
				<div class="flex items-center gap-3">
					<Button type="submit" loading={busy}>{busy ? 'Saving…' : 'Save Changes'}</Button>
					<button
						type="button"
						onclick={() => (editing = false)}
						class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<section class="rounded-xl border border-border bg-white p-5 shadow-sm">
				<h2 class="mb-4 text-base font-bold text-slate-900">{customer.name}</h2>
				<dl class="space-y-3 text-sm">
					<div>
						<dt class="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">Phone</dt>
						<dd class="text-slate-700">{customer.phone}</dd>
					</div>
					{#if customer.whatsappPhone}
						<div>
							<dt class="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
								WhatsApp
							</dt>
							<dd class="text-slate-700">{customer.whatsappPhone}</dd>
						</div>
					{/if}
					{#if customer.email}
						<div>
							<dt class="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
								Email
							</dt>
							<dd class="text-slate-700">{customer.email}</dd>
						</div>
					{/if}
					{#if customer.address}
						<div>
							<dt class="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
								Address
							</dt>
							<dd class="text-slate-700">{customer.address}</dd>
						</div>
					{/if}
					<div>
						<dt class="text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
							Customer Since
						</dt>
						<dd class="text-slate-700">{formatDate(customer.createdAt)}</dd>
					</div>
				</dl>
			</section>

			<section class="lg:col-span-2">
				<div
					class="mb-4 flex gap-1 border-b border-border"
					role="tablist"
					aria-label="Customer sections"
				>
					{#each TABS as t (t.id)}
						<button
							role="tab"
							aria-selected={tab === t.id}
							onclick={() => (tab = t.id)}
							class="px-4 py-2 text-sm font-semibold {tab === t.id
								? 'border-b-2 border-brand-500 text-brand-600'
								: 'text-slate-500 hover:text-slate-900'}"
						>
							{t.label}
							{t.id === 'devices' ? ` (${devices.length})` : ''}
						</button>
					{/each}
				</div>

				{#if tab === 'devices'}
					{#if devices.length === 0}
						<EmptyState message="No devices registered for this customer yet." />
					{:else}
						<DataTable
							columns={deviceColumns}
							rows={devices}
							keyOf={(d) => d.id}
							cells={{
								device: deviceCell,
								serial: serialCell,
								color: colorCell,
								createdAt: addedCell
							}}
							testid="customer-devices"
						/>
					{/if}
				{:else if tab === 'repairs'}
					<EmptyState message="Repair history appears here once the repairs phase lands." />
				{:else if tab === 'history'}
					<EmptyState message="Status history appears here once the repairs phase lands." />
				{:else}
					<div class="rounded-xl border border-border bg-white p-5 shadow-sm">
						<h3 class="mb-2 text-sm font-bold text-slate-900">Notes</h3>
						<p class="text-sm text-slate-600">{customer.notes ?? 'No notes recorded.'}</p>
					</div>
				{/if}
			</section>
		</div>
	{/if}
{/if}

{#snippet deviceCell(row: Device)}
	<span class="font-medium whitespace-nowrap text-slate-800">
		{row.brand}
		{row.model}
	</span>
	<span class="block text-[11px] text-slate-400 capitalize">{row.category}</span>
{/snippet}

{#snippet serialCell(row: Device)}
	<span class="font-mono text-xs whitespace-nowrap">{row.serialNumber ?? row.imei ?? '—'}</span>
{/snippet}

{#snippet colorCell(row: Device)}
	<span>{row.color ?? '—'}</span>
{/snippet}

{#snippet addedCell(row: Device)}
	<span class="whitespace-nowrap">{formatDate(row.createdAt)}</span>
{/snippet}
