import { z } from 'zod';

/** Backend customer resource (snake_case, as returned by the API). */
export const CustomerResourceSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		phone: z.string(),
		whatsapp_phone: z.string().nullable().optional(),
		email: z.string().email().nullable().optional(),
		address: z.string().nullable().optional(),
		notes: z.string().nullable().optional(),
		devices_count: z.number(),
		created_at: z.string(),
		updated_at: z.string()
	})
	.passthrough();
export type CustomerResource = z.infer<typeof CustomerResourceSchema>;

/** Canonical app-facing customer (camelCase). */
export const CustomerSchema = z.object({
	id: z.number(),
	name: z.string(),
	phone: z.string(),
	whatsappPhone: z.string().nullable(),
	email: z.string().nullable(),
	address: z.string().nullable(),
	notes: z.string().nullable(),
	devicesCount: z.number(),
	createdAt: z.string(),
	updatedAt: z.string()
});
export type Customer = z.infer<typeof CustomerSchema>;

export function toCustomer(resource: CustomerResource): Customer {
	return {
		id: resource.id,
		name: resource.name,
		phone: resource.phone,
		whatsappPhone: resource.whatsapp_phone ?? null,
		email: resource.email ?? null,
		address: resource.address ?? null,
		notes: resource.notes ?? null,
		devicesCount: resource.devices_count,
		createdAt: resource.created_at,
		updatedAt: resource.updated_at
	};
}

/** Laravel paginator envelope wrapping customer resources. */
export const CustomerListResponseSchema = z.object({
	data: z.object({
		current_page: z.number(),
		data: z.array(CustomerResourceSchema),
		per_page: z.number(),
		last_page: z.number(),
		total: z.number()
	}),
	message: z.string()
});

export const CustomerPageSchema = z.object({
	data: z.array(CustomerSchema),
	total: z.number(),
	page: z.number(),
	perPage: z.number(),
	lastPage: z.number()
});
export type CustomerPage = z.infer<typeof CustomerPageSchema>;

export function toCustomerPage(response: z.infer<typeof CustomerListResponseSchema>): CustomerPage {
	return {
		data: response.data.data.map(toCustomer),
		total: response.data.total,
		page: response.data.current_page,
		perPage: response.data.per_page,
		lastPage: response.data.last_page
	};
}

export const CreateCustomerSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	phone: z.string().min(1, 'Phone is required'),
	whatsapp_phone: z.string().nullable().optional(),
	email: z.string().email('Enter a valid email address').nullable().optional(),
	address: z.string().nullable().optional(),
	notes: z.string().nullable().optional()
});
export type CreateCustomerInput = z.infer<typeof CreateCustomerSchema>;

export const UpdateCustomerSchema = CreateCustomerSchema.partial();
export type UpdateCustomerInput = z.infer<typeof UpdateCustomerSchema>;

export const CustomerFiltersSchema = z.object({
	search: z.string().optional(),
	sort: z.enum(['newest', 'oldest', 'name']).optional(),
	page: z.number().int().min(1).optional(),
	perPage: z.number().int().min(1).max(100).optional()
});
export type CustomerFilters = z.infer<typeof CustomerFiltersSchema>;
