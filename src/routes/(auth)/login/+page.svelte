<script lang="ts">
	import { page } from '$app/state';
	import { sanitizeRedirect } from '$lib/features/login/request';
	import LoginHero from '$lib/features/login/components/LoginHero.svelte';
	import LoginPanel from '$lib/features/login/components/LoginPanel.svelte';

	const redirectTarget = $derived(sanitizeRedirect(page.url.searchParams.get('redirect')));
</script>

<div class="flex min-h-screen flex-col justify-center bg-auth-page p-0 antialiased md:p-6 lg:p-8">
	<main
		class="mx-auto grid w-full max-w-[1440px] grid-cols-1 overflow-hidden bg-white shadow-xl md:rounded-2xl lg:grid-cols-12"
	>
		<LoginHero />
		<LoginPanel target={redirectTarget} />
	</main>
</div>
