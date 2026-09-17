<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import {
		getSystemStatus,
		loginWithRedirect,
		sanitizeRedirect
	} from '$lib/features/login/request';
	import type { SystemStatus } from '$lib/features/login/request';
	import LoginHero from '$lib/features/login/components/LoginHero.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import PasswordInput from '$lib/components/ui/PasswordInput.svelte';

	// Logic lives in features/login/request — this file is presentational (screens/login.html).
	let email = $state('');
	let password = $state('');
	let submitting = $state(false);
	let error = $state<string | null>(null);
	let fieldErrors = $state<{ email?: string; password?: string }>({});
	let systemStatus = $state<SystemStatus>('unknown');
	const redirectTarget = $derived(sanitizeRedirect(page.url.searchParams.get('redirect')));

	$effect(() => {
		getSystemStatus().then((s) => {
			systemStatus = s;
		});
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitting = true;
		try {
			const result = await loginWithRedirect(email, password, undefined, redirectTarget);
			error = result.error ?? null;
			fieldErrors = result.fieldErrors ?? {};
		} finally {
			submitting = false;
		}
	}
</script>

<div class="flex min-h-screen flex-col justify-center bg-auth-page p-0 antialiased md:p-6 lg:p-8">
	<main
		class="mx-auto grid w-full max-w-[1440px] grid-cols-1 overflow-hidden bg-white shadow-xl md:rounded-2xl lg:grid-cols-12"
	>
		<LoginHero />

		<section
			class="flex flex-col items-center justify-center bg-auth-panel px-6 py-12 lg:col-span-7 lg:px-16"
		>
			<div class="flex w-full max-w-[460px] flex-col">
				<div class="mb-6 flex items-center gap-2 lg:hidden">
					<div class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
						<svg
							class="h-5 w-5 -rotate-45 text-white"
							fill="none"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2.2"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
							></path>
						</svg>
					</div>
					<span class="text-xl font-bold tracking-tight text-gray-900">Fixora</span>
				</div>

				<header class="mb-8 text-center">
					<h2 class="text-[28px] font-bold tracking-tight text-gray-900">Welcome back</h2>
					<p class="mt-2 text-sm text-gray-500">
						Enter your credentials to access your workshop dashboard.
					</p>
				</header>

				<div
					class="rounded-xl border border-gray-200/80 bg-white p-7 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
				>
					{#if error}
						<div class="mb-5">
							<Alert variant="error" message={error} testid="login-error" />
						</div>
					{/if}

					<form onsubmit={handleSubmit} class="space-y-5" novalidate>
						<FormField label="Email Address" inputId="email" error={fieldErrors.email}>
							{#snippet aside()}
								<span class="text-[10px] font-medium tracking-wide text-gray-400 uppercase">
									Required
								</span>
							{/snippet}
							<TextInput
								id="email"
								type="email"
								autocomplete="username"
								placeholder="name@workshop.com"
								bind:value={email}
								invalid={!!fieldErrors.email}
								describedby={fieldErrors.email ? 'email-error' : undefined}
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
											d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
											stroke-linecap="round"
											stroke-linejoin="round"
										></path>
									</svg>
								{/snippet}
							</TextInput>
						</FormField>

						<FormField label="Password" inputId="password" error={fieldErrors.password}>
							{#snippet aside()}
								<a
									href={resolve('/forgot-password')}
									class="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
								>
									Forgot password?
								</a>
							{/snippet}
							<PasswordInput
								id="password"
								bind:value={password}
								invalid={!!fieldErrors.password}
								describedby={fieldErrors.password ? 'password-error' : undefined}
							/>
						</FormField>

						<div class="pt-2">
							<Button type="submit" loading={submitting}>
								{#snippet icon()}
									<svg
										class="h-4 w-4"
										fill="none"
										stroke="currentColor"
										stroke-width="2.2"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
											stroke-linecap="round"
											stroke-linejoin="round"
										></path>
									</svg>
								{/snippet}
								{submitting ? 'Signing in…' : 'Sign in to Fixora'}
							</Button>
						</div>

						<div class="relative py-2">
							<div class="absolute inset-0 flex items-center">
								<div class="w-full border-t border-gray-200"></div>
							</div>
							<div
								class="relative flex justify-center text-[10px] font-bold tracking-widest uppercase"
							>
								<span class="bg-white px-3 text-gray-500">Authorized access only</span>
							</div>
						</div>

						<div class="pt-1 pb-1 text-center text-xs text-gray-600">
							<span>New technician?</span>
							<span class="ml-1 font-semibold text-indigo-600">Contact Administrator</span>
						</div>
					</form>
				</div>

				<section class="mt-4 grid grid-cols-2 gap-3">
					<div
						class="flex items-center justify-between rounded-lg border border-gray-200/80 bg-white p-3.5 shadow-sm"
					>
						<div>
							<span class="block text-xs leading-tight font-semibold text-gray-800"
								>Help Center</span
							>
							<span class="mt-0.5 block text-[11px] text-gray-400">User Manuals</span>
						</div>
					</div>
					<div
						class="flex items-center justify-between rounded-lg border border-gray-200/80 bg-white p-3.5 shadow-sm"
					>
						<div>
							<span class="block text-xs leading-tight font-semibold text-gray-800">
								System Status
							</span>
							{#if systemStatus === 'operational'}
								<span class="mt-0.5 block text-[11px] font-medium text-emerald-600">
									All Operational
								</span>
							{:else}
								<span class="mt-0.5 block text-[11px] font-medium text-gray-400">Unknown</span>
							{/if}
						</div>
						<span class="relative flex h-2 w-2">
							{#if systemStatus === 'operational'}
								<span
									class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"
								></span>
								<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
							{:else}
								<span class="relative inline-flex h-2 w-2 rounded-full bg-gray-300"></span>
							{/if}
						</span>
					</div>
				</section>

				<footer class="mt-8 text-center text-xs text-gray-500">
					Problems signing in? Reach out to
					<a class="font-medium text-indigo-600 hover:underline" href="mailto:it-support@fixora.io">
						it-support@fixora.io
					</a>
				</footer>
			</div>
		</section>
	</main>
</div>
