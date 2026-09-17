<script lang="ts">
	interface Props {
		message: string;
		actionLabel?: string;
		actionHref?: string;
	}

	let { message, actionLabel, actionHref }: Props = $props();
</script>

<div class="rounded-lg border border-border bg-surface p-6 text-center shadow-sm">
	<p class="text-sm text-slate-500">{message}</p>
	{#if actionLabel && actionHref}
		<p class="mt-3">
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- actionHref arrives pre-resolved -->
			<a href={actionHref} class="text-sm font-semibold text-primary-600 hover:text-primary-700">
				{actionLabel}
			</a>
		</p>
	{/if}
</div>
