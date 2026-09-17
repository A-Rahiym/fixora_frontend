import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Alert from '$lib/components/ui/Alert.svelte';
import EmptyState from '$lib/components/shared/EmptyState.svelte';
import LoadingState from '$lib/components/shared/LoadingState.svelte';
import MetricCard from '$lib/components/shared/MetricCard.svelte';

describe('Alert', () => {
	it('uses role=alert for errors and role=status for success', () => {
		const error = render(Alert, { props: { variant: 'error', message: 'Bad' } });
		expect(error.body).toContain('role="alert"');
		expect(error.body).toContain('Bad');

		const success = render(Alert, { props: { variant: 'success', message: 'Good' } });
		expect(success.body).toContain('role="status"');
		expect(success.body).toContain('Good');
	});
});

describe('states', () => {
	it('EmptyState renders message and optional action', () => {
		const plain = render(EmptyState, { props: { message: 'Nothing here' } });
		expect(plain.body).toContain('Nothing here');
		expect(plain.body).not.toContain('<a ');

		const withAction = render(EmptyState, {
			props: { message: 'Nothing here', actionLabel: 'Add one', actionHref: '/add' }
		});
		expect(withAction.body).toContain('Add one');
	});

	it('LoadingState announces via role=status', () => {
		const loading = render(LoadingState, { props: { label: 'Wait…' } });
		expect(loading.body).toContain('role="status"');
	});
});

describe('MetricCard', () => {
	it('renders label, value, caption and trend', () => {
		const card = render(MetricCard, {
			props: {
				label: 'Active Jobs',
				value: '42',
				caption: 'Current repairs in progress',
				trend: { direction: 'up', text: '+12%' }
			}
		});
		expect(card.body).toContain('Active Jobs');
		expect(card.body).toContain('42');
		expect(card.body).toContain('+12%');
	});
});
