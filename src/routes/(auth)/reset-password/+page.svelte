<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { resetWithToken } from '$lib/features/reset-password/request';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import PasswordInput from '$lib/components/ui/PasswordInput.svelte';

	const token = $derived(page.url.searchParams.get('token') ?? '');

	let password = $state('');
	let passwordConfirm = $state('');
	let submitting = $state(false);
	let done = $state(false);
	let error = $state<string | null>(null);
	let fieldErrors = $state<{ password?: string; passwordConfirm?: string }>({});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		try {
			const result = await resetWithToken(token, password, passwordConfirm);
			done = result.ok;
			error = result.error ?? null;
			fieldErrors = result.fieldErrors ?? {};
		} finally {
			submitting = false;
		}
	}
</script>

<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
	<div class="mb-6">
		<p class="text-xl font-bold text-slate-900">Fixora</p>
		<h1 class="mt-1 text-lg font-semibold text-slate-900">Set a new password</h1>
	</div>

	{#if !token}
		<Alert
			variant="error"
			message="This reset link is invalid or missing its token. Request a new one."
			testid="reset-no-token"
		/>
		<p class="mt-4 text-center text-sm">
			<a href={resolve('/forgot-password')} class="text-primary-600 hover:text-primary-700">
				Request a new link
			</a>
		</p>
	{:else if done}
		<Alert
			variant="success"
			message="Password updated. You can now log in."
			testid="reset-success"
		/>
		<div class="mt-4">
			<Button onclick={() => goto(resolve('/login'))}>Back to login</Button>
		</div>
	{:else}
		{#if error}
			<div class="mb-4">
				<Alert variant="error" message={error} />
			</div>
		{/if}
		<form onsubmit={handleSubmit} class="space-y-4" novalidate>
			<FormField label="New password" inputId="password" error={fieldErrors.password}>
				<PasswordInput
					id="password"
					autocomplete="new-password"
					bind:value={password}
					invalid={!!fieldErrors.password}
					describedby={fieldErrors.password ? 'password-error' : undefined}
				/>
			</FormField>
			<FormField
				label="Confirm new password"
				inputId="passwordConfirm"
				error={fieldErrors.passwordConfirm}
			>
				<PasswordInput
					id="passwordConfirm"
					autocomplete="new-password"
					bind:value={passwordConfirm}
					invalid={!!fieldErrors.passwordConfirm}
					describedby={fieldErrors.passwordConfirm ? 'passwordConfirm-error' : undefined}
				/>
			</FormField>
			<Button type="submit" loading={submitting}>
				{submitting ? 'Saving…' : 'Set new password'}
			</Button>
		</form>
	{/if}
</div>
