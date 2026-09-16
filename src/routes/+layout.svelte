<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { createAppQueryClient } from '$lib/config/queryClient';

	const queryClient = createAppQueryClient();
	const { children } = $props();
</script>

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
