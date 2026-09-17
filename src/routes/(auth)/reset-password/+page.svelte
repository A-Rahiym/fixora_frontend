<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { resetWithToken } from '$lib/features/reset-password/request';

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
		<p
			data-testid="reset-no-token"
			role="alert"
			class="rounded-lg bg-red-50 p-3 text-sm text-red-700"
		>
			This reset link is invalid or missing its token. Request a new one.
		</p>
		<p class="mt-4 text-center text-sm">
			<a href={resolve('/forgot-password')} class="text-primary-600 hover:text-primary-700"
				>Request a new link</a
			>
		</p>
	{:else if done}
		<p
			data-testid="reset-success"
			role="status"
			class="rounded-lg bg-green-50 p-3 text-sm text-green-800"
		>
			Password updated. You can now log in.
		</p>
		<button
			onclick={() => goto(resolve('/login'))}
			class="mt-4 w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
		>
			Back to login
		</button>
	{:else}
		{#if error}
			<p role="alert" class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
		{/if}
		<form onsubmit={handleSubmit} class="space-y-4" novalidate>
			<div>
				<label for="password" class="mb-1 block text-sm font-medium text-slate-700"
					>New password</label
				>
				<input
					id="password"
					type="password"
					autocomplete="new-password"
					bind:value={password}
					aria-invalid={!!fieldErrors.password}
					class="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
				/>
				{#if fieldErrors.password}<p class="mt-1 text-xs text-red-600">
						{fieldErrors.password}
					</p>{/if}
			</div>
			<div>
				<label for="passwordConfirm" class="mb-1 block text-sm font-medium text-slate-700">
					Confirm new password
				</label>
				<input
					id="passwordConfirm"
					type="password"
					autocomplete="new-password"
					bind:value={passwordConfirm}
					aria-invalid={!!fieldErrors.passwordConfirm}
					class="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
				/>
				{#if fieldErrors.passwordConfirm}<p class="mt-1 text-xs text-red-600">
						{fieldErrors.passwordConfirm}
					</p>{/if}
			</div>
			<button
				type="submit"
				disabled={submitting}
				class="w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
			>
				{submitting ? 'Saving…' : 'Set new password'}
			</button>
		</form>
	{/if}
</div>
