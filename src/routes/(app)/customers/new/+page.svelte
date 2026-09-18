<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { useQueryClient } from '@tanstack/svelte-query';
	import { submitCustomer } from '$lib/features/customers/new/request';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const queryClient = useQueryClient();

	let name = $state('');
	let phone = $state('');
	let whatsappPhone = $state('');
	let email = $state('');
	let address = $state('');
	let notes = $state('');
	let submitting = $state(false);
	let error = $state<string | null>(null);
	let duplicate = $state<{ id: number; name: string; phone: string } | null>(null);
	let fieldErrors = $state<Record<string, string | undefined>>({});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		try {
			const result = await submitCustomer(queryClient, {
				name,
				phone,
				whatsapp_phone: whatsappPhone || null,
				email: email || null,
				address: address || null,
				notes: notes || null
			});
			if (result.ok && result.id !== undefined) {
				await goto(resolve(`/customers/${result.id}`));
				return;
			}
			error = result.error ?? null;
			duplicate = result.duplicate ?? null;
			fieldErrors = result.fieldErrors ?? {};
		} finally {
			submitting = false;
		}
	}
</script>

<div class="mx-auto w-full max-w-2xl space-y-6">
	<div>
		<h1 class="text-2xl font-bold tracking-tight text-slate-900">New Customer</h1>
		<p class="mt-0.5 text-xs text-slate-500">
			Register a customer before creating their first job.
		</p>
	</div>

	<div class="rounded-xl border border-border bg-white p-6 shadow-sm sm:p-8">
		{#if error}
			<div class="mb-5 space-y-3">
				<Alert variant="warning" message={error} testid="customer-duplicate" />
				{#if duplicate}
					{@const existing = duplicate}
					<p class="text-sm text-slate-600">
						Existing record:
						<button
							onclick={() => goto(resolve(`/customers/${existing.id}`))}
							class="font-semibold text-brand-600 hover:text-brand-700"
						>
							{existing.name} · {existing.phone}
						</button>
					</p>
				{/if}
			</div>
		{/if}

		<form onsubmit={handleSubmit} class="space-y-4" novalidate>
			<FormField label="Full Name" inputId="name" error={fieldErrors.name}>
				<TextInput
					id="name"
					autocomplete="name"
					placeholder="e.g. Eleanor Shellstrop"
					bind:value={name}
					invalid={!!fieldErrors.name}
					describedby={fieldErrors.name ? 'name-error' : undefined}
				/>
			</FormField>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<FormField label="Phone" inputId="phone" error={fieldErrors.phone}>
					<TextInput
						id="phone"
						type="tel"
						autocomplete="tel"
						placeholder="+260…"
						bind:value={phone}
						invalid={!!fieldErrors.phone}
						describedby={fieldErrors.phone ? 'phone-error' : undefined}
					/>
				</FormField>
				<FormField label="WhatsApp (optional)" inputId="whatsapp">
					<TextInput
						id="whatsapp"
						type="tel"
						autocomplete="tel"
						placeholder="+260…"
						bind:value={whatsappPhone}
					/>
				</FormField>
			</div>

			<FormField label="Email (optional)" inputId="email" error={fieldErrors.email}>
				<TextInput
					id="email"
					type="email"
					autocomplete="email"
					placeholder="name@example.com"
					bind:value={email}
					invalid={!!fieldErrors.email}
					describedby={fieldErrors.email ? 'email-error' : undefined}
				/>
			</FormField>

			<FormField label="Address (optional)" inputId="address">
				<TextInput id="address" autocomplete="street-address" bind:value={address} />
			</FormField>

			<FormField label="Notes (optional)" inputId="notes">
				<TextInput id="notes" bind:value={notes} />
			</FormField>

			<div class="flex items-center gap-3 pt-2">
				<Button type="submit" loading={submitting}>
					{submitting ? 'Saving…' : 'Save Customer'}
				</Button>
				<button
					type="button"
					onclick={() => goto(resolve('/customers'))}
					class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
				>
					Cancel
				</button>
			</div>
		</form>
	</div>
</div>
