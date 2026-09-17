<script lang="ts">
	import { resolve } from '$app/paths';
	import { loginWithRedirect } from '$lib/features/login/request';

	// Guide placeholder UI — visuals will be restyled later; logic lives in features/login/request.
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);
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
		<p
			data-testid="login-error"
			role="alert"
			class="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
		>
			{error}
		</p>
	{/if}

	<form onsubmit={handleSubmit} class="space-y-4" novalidate>
		<div>
			<label for="email" class="mb-1 block text-sm font-medium text-slate-700">Email</label>
			<input
				id="email"
				type="email"
				autocomplete="username"
				bind:value={email}
				aria-invalid={!!fieldErrors.email}
				class="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
			/>
			{#if fieldErrors.email}<p class="mt-1 text-xs text-red-600">{fieldErrors.email}</p>{/if}
		</div>

		<div>
			<label for="password" class="mb-1 block text-sm font-medium text-slate-700">Password</label>
			<div class="relative">
				<input
					id="password"
					type={showPassword ? 'text' : 'password'}
					autocomplete="current-password"
					bind:value={password}
					aria-invalid={!!fieldErrors.password}
					class="w-full rounded-lg border border-border bg-white px-3 py-2 pr-16 text-sm focus:border-primary-500 focus:outline-none"
				/>
				<button
					type="button"
					onclick={() => (showPassword = !showPassword)}
					class="absolute top-1/2 right-2 -translate-y-1/2 rounded px-2 py-1 text-xs text-slate-500 hover:text-slate-800"
				>
					{showPassword ? 'Hide' : 'Show'}
				</button>
			</div>
			{#if fieldErrors.password}<p class="mt-1 text-xs text-red-600">{fieldErrors.password}</p>{/if}
		</div>

		<button
			type="submit"
			disabled={submitting}
			class="w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
		>
			{submitting ? 'Logging in…' : 'Log in'}
		</button>
	</form>

	<p class="mt-4 text-center text-sm">
		<a href={resolve('/forgot-password')} class="text-primary-600 hover:text-primary-700"
			>Forgot password?</a
		>
	</p>
</div>
