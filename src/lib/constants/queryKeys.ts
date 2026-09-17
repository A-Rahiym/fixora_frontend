export const queryKeys = {
	me: ['auth', 'me'] as const,
	repairs: ['repairs'] as const,
	repair: (id: number) => ['repairs', id] as const,
	customers: ['customers'] as const,
	inventory: ['inventory'] as const
};
