<script lang="ts">
	import { resolve } from '$app/paths';
	import { requestResetLink } from '$lib/features/forgot-password/request';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	let email = $state('');
	let submitting = $state(false);
	let sent = $state(false);
	let error = $state<string | null>(null);
	let fieldError = $state<string | undefined>(undefined);

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		try {
			const result = await requestResetLink(email);
			sent = result.sent;
			error = result.error ?? null;
			fieldError = result.fieldError;
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-auth-page p-4">
	<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
		<div class="mb-6">
			<p class="text-xl font-bold text-slate-900">Fixora</p>
			<h1 class="mt-1 text-lg font-semibold text-slate-900">Forgot password</h1>
			<p class="text-sm text-slate-500">We'll email you a reset link.</p>
		</div>

		{#if sent}
			<Alert
				variant="success"
				message="If an account exists for that email, a reset link is on its way."
				testid="forgot-success"
			/>
			<p class="mt-4 text-center text-sm">
				<a href={resolve('/login')} class="text-primary-600 hover:text-primary-700">Back to login</a
				>
			</p>
		{:else}
			{#if error}
				<div class="mb-4">
					<Alert variant="error" message={error} />
				</div>
			{/if}
			<form onsubmit={handleSubmit} class="space-y-4" novalidate>
				<FormField label="Email" inputId="email" error={fieldError}>
					<TextInput
						id="email"
						type="email"
						autocomplete="email"
						bind:value={email}
						invalid={!!fieldError}
						describedby={fieldError ? 'email-error' : undefined}
					/>
				</FormField>
				<Button type="submit" loading={submitting}>
					{submitting ? 'Sending…' : 'Send reset link'}
				</Button>
			</form>
			<p class="mt-4 text-center text-sm">
				<a href={resolve('/login')} class="text-primary-600 hover:text-primary-700">Back to login</a
				>
			</p>
		{/if}
	</div>
</div>
