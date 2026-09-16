/** Format an amount with tabular numerals (guide §4 DataTable rule). */
export function formatCurrency(amount: number | null | undefined, currency = 'ZMW'): string {
	if (amount === null || amount === undefined) return '—';
	return new Intl.NumberFormat('en-ZM', {
		style: 'currency',
		currency,
		minimumFractionDigits: 2
	}).format(amount);
}
