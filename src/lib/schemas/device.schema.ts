import { z } from 'zod';

/** Backend device resource (snake_case, as returned by the API). */
export const DeviceResourceSchema = z
	.object({
		id: z.number(),
		customer_id: z.number(),
		category: z.string(),
		brand: z.string(),
		model: z.string(),
		serial_number: z.string().nullable().optional(),
		imei: z.string().nullable().optional(),
		color: z.string().nullable().optional(),
		notes: z.string().nullable().optional(),
		created_at: z.string(),
		updated_at: z.string()
	})
	.passthrough();
export type DeviceResource = z.infer<typeof DeviceResourceSchema>;

/** Canonical app-facing device (camelCase). */
export const DeviceSchema = z.object({
	id: z.number(),
	customerId: z.number(),
	category: z.string(),
	brand: z.string(),
	model: z.string(),
	serialNumber: z.string().nullable(),
	imei: z.string().nullable(),
	color: z.string().nullable(),
	notes: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string()
});
export type Device = z.infer<typeof DeviceSchema>;

export function toDevice(resource: DeviceResource): Device {
	return {
		id: resource.id,
		customerId: resource.customer_id,
		category: resource.category,
		brand: resource.brand,
		model: resource.model,
		serialNumber: resource.serial_number ?? null,
		imei: resource.imei ?? null,
		color: resource.color ?? null,
		notes: resource.notes ?? null,
		createdAt: resource.created_at,
		updatedAt: resource.updated_at
	};
}

/** GET /api/v1/customers/:id detail envelope (customer + embedded devices). */
export const CustomerDetailResponseSchema = z.object({
	data: z.object({
		customer: z.object({
			id: z.number(),
			name: z.string(),
			phone: z.string(),
			whatsapp_phone: z.string().nullable().optional(),
			email: z.string().email().nullable().optional(),
			address: z.string().nullable().optional(),
			notes: z.string().nullable().optional(),
			devices_count: z.number(),
			devices: z.array(DeviceResourceSchema),
			created_at: z.string(),
			updated_at: z.string()
		})
	}),
	message: z.string()
});

export interface CustomerDetail {
	customer: import('./customer.schema').Customer;
	devices: Device[];
}
