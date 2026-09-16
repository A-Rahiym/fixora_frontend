import { describe, expect, it } from 'vitest';
import { formatCurrency } from './currency';

describe('formatCurrency', () => {
	it('formats amounts with currency code', () => {
		expect(formatCurrency(1250)).toMatch(/1,250/);
	});

	it('returns em dash for null/undefined', () => {
		expect(formatCurrency(null)).toBe('—');
		expect(formatCurrency(undefined)).toBe('—');
	});
});
