<script lang="ts">
	import { resolve } from '$app/paths';
	import { requestResetLink } from '$lib/features/forgot-password/request';

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

<div class="w-full max-w-sm rounded-xl border border-border bg-surface p-8 shadow-sm">
	<div class="mb-6">
		<p class="text-xl font-bold text-slate-900">Fixora</p>
		<h1 class="mt-1 text-lg font-semibold text-slate-900">Forgot password</h1>
		<p class="text-sm text-slate-500">We'll email you a reset link.</p>
	</div>

	{#if sent}
		<p
			data-testid="forgot-success"
			role="status"
			class="rounded-lg bg-green-50 p-3 text-sm text-green-800"
		>
			If an account exists for that email, a reset link is on its way.
		</p>
		<p class="mt-4 text-center text-sm">
			<a href={resolve('/login')} class="text-primary-600 hover:text-primary-700">Back to login</a>
		</p>
	{:else}
		{#if error}
			<p role="alert" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
		{/if}
		<form onsubmit={handleSubmit} class="space-y-4" novalidate>
			<div>
				<label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
				<input
					id="email"
					type="email"
					autocomplete="email"
					bind:value={email}
					aria-invalid={!!fieldError}
					class="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
				/>
				{#if fieldError}<p class="mt-1 text-xs text-red-600">{fieldError}</p>{/if}
			</div>
			<button
				type="submit"
				disabled={submitting}
				class="w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
			>
				{submitting ? 'Sending…' : 'Send reset link'}
			</button>
		</form>
		<p class="mt-4 text-center text-sm">
			<a href={resolve('/login')} class="text-primary-600 hover:text-primary-700">Back to login</a>
		</p>
	{/if}
</div>
