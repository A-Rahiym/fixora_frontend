import { describe, expect, it } from 'vitest';
import { getRepair, getRepairs } from '$lib/api/repairs';

describe('repairs list', () => {
	it('returns a validated page when backend is unreachable', async () => {
		const page = await getRepairs();
		expect(page.total).toBe(6);
		expect(page.data.length).toBeGreaterThan(0);
		expect(page.data[0].jobNumber).toBe('#8842');
	});

	it('filters by status', async () => {
		const page = await getRepairs({ status: 'received' });
		expect(page.total).toBe(1);
		expect(page.data[0].jobNumber).toBe('#8839');
	});

	it('searches across job, customer and device', async () => {
		expect((await getRepairs({ search: 'sarah' })).total).toBe(1);
		expect((await getRepairs({ search: 'iphone' })).total).toBe(1);
		expect((await getRepairs({ search: '#884' })).total).toBe(3);
	});

	it('sorts oldest first and paginates', async () => {
		const first = await getRepairs({ sort: 'oldest', perPage: 2, page: 1 });
		const second = await getRepairs({ sort: 'oldest', perPage: 2, page: 2 });
		expect(first.data[0].jobNumber).toBe('#8837');
		expect(second.page).toBe(2);
		expect(second.lastPage).toBe(3);
	});

	it('returns a single repair by id', async () => {
		expect((await getRepair(8841)).jobNumber).toBe('#8841');
	});
});
