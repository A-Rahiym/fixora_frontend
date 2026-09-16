export const queryKeys = {
	repairs: ['repairs'] as const,
	repair: (id: number) => ['repairs', id] as const,
	customers: ['customers'] as const,
	inventory: ['inventory'] as const
};
