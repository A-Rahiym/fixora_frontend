<script lang="ts">
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	interface Props {
		message: string;
		retryLabel?: string;
		onretry?: () => void;
	}

	let { message, retryLabel = 'Try again', onretry }: Props = $props();
</script>

<div class="space-y-3 rounded-lg border border-border bg-surface p-6 shadow-sm">
	<Alert variant="error" {message} />
	{#if onretry}
		<Button variant="secondary" onclick={onretry}>{retryLabel}</Button>
	{/if}
</div>
