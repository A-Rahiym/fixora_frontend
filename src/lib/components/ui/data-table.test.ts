import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import DataTable from './DataTable.svelte';
import Select from './Select.svelte';

interface Row extends Record<string, unknown> {
	id: number;
	name: string;
}

const columns = [
	{ key: 'id', label: 'ID' },
	{ key: 'name', label: 'Name', render: (r: Row) => r.name.toUpperCase() }
];
const rows: Row[] = [
	{ id: 1, name: 'alpha' },
	{ id: 2, name: 'beta' }
];

describe('DataTable', () => {
	it('renders headers and formatted rows', () => {
		const table = render(DataTable, {
			props: { columns, rows, keyOf: (r: Row) => r.id, testid: 'jobs-table' }
		});
		expect(table.body).toContain('ID');
		expect(table.body).toContain('ALPHA');
		expect(table.body).toContain('data-testid="jobs-table"');
	});

	it('renders pagination footer when provided', () => {
		const table = render(DataTable, {
			props: {
				columns,
				rows,
				keyOf: (r: Row) => r.id,
				pagination: { page: 1, lastPage: 3, total: 6, perPage: 2, onpage: () => {} }
			}
		});
		expect(table.body).toContain('Page 1 of 3');
		expect(table.body).toContain('Previous');
	});
});

describe('Select', () => {
	it('renders options', () => {
		const select = render(Select, {
			props: {
				id: 'status',
				value: '',
				options: [
					{ value: '', label: 'All Statuses' },
					{ value: 'received', label: 'New' }
				]
			}
		});
		expect(select.body).toContain('All Statuses');
		expect(select.body).toContain('value="received"');
	});
});
