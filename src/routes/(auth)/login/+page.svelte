<script lang="ts">
	import { resolve } from '$app/paths';
	import { loginWithRedirect } from '$lib/features/login/request';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import PasswordInput from '$lib/components/ui/PasswordInput.svelte';

	// Guide placeholder UI — visuals will be restyled later; logic lives in features/login/request.
	let email = $state('');
	let password = $state('');
	let submitting = $state(false);
	let error = $state<string | null>(null);
	let fieldErrors = $state<{ email?: string; password?: string }>({});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		try {
			const result = await loginWithRedirect(email, password);
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
		<h1 class="mt-1 text-lg font-semibold text-slate-900">Log in</h1>
		<p class="text-sm text-slate-500">Access your repair shop workspace.</p>
	</div>

	{#if error}
		<div class="mb-4">
			<Alert variant="error" message={error} testid="login-error" />
		</div>
	{/if}

	<form onsubmit={handleSubmit} class="space-y-4" novalidate>
		<FormField label="Email" inputId="email" error={fieldErrors.email}>
			<TextInput
				id="email"
				type="email"
				autocomplete="username"
				bind:value={email}
				invalid={!!fieldErrors.email}
				describedby={fieldErrors.email ? 'email-error' : undefined}
			/>
		</FormField>

		<FormField label="Password" inputId="password" error={fieldErrors.password}>
			<PasswordInput
				id="password"
				bind:value={password}
				invalid={!!fieldErrors.password}
				describedby={fieldErrors.password ? 'password-error' : undefined}
			/>
		</FormField>

		<Button type="submit" loading={submitting}>{submitting ? 'Logging in…' : 'Log in'}</Button>
	</form>

	<p class="mt-4 text-center text-sm">
		<a href={resolve('/forgot-password')} class="text-primary-600 hover:text-primary-700">
			Forgot password?
		</a>
	</p>
</div>
