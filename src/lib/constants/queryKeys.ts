export const queryKeys = {
	me: ['auth', 'me'] as const,
	dashboard: ['dashboard'] as const,
	repairs: ['repairs'] as const,
	repair: (id: number) => ['repairs', id] as const,
	customers: ['customers'] as const,
	customersList: (filters: Record<string, string | number | undefined>) =>
		['customers', 'list', filters] as const,
	customerDetail: (id: number) => ['customers', id] as const,
	inventory: ['inventory'] as const
};
