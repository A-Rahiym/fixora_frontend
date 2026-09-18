import { apiClient, type ApiErrorShape } from './client';
import {
	CreateCustomerSchema,
	CustomerListResponseSchema,
	CustomerResourceSchema,
	UpdateCustomerSchema,
	toCustomer,
	toCustomerPage,
	type CreateCustomerInput,
	type Customer,
	type CustomerFilters,
	type CustomerPage,
	type UpdateCustomerInput
} from '$lib/schemas/customer.schema';
import {
	CustomerDetailResponseSchema,
	toDevice,
	type CustomerDetail
} from '$lib/schemas/device.schema';

/** Duplicate-phone error carrying the existing record (never a silent duplicate). */
export interface DuplicateCustomerError extends ApiErrorShape {
	duplicate: Customer;
}

function toDuplicateError(err: unknown, fallback: string): DuplicateCustomerError {
	const shape = err as ApiErrorShape;
	const errors = shape.errors as { customer?: unknown } | undefined;
	if (!errors || !errors.customer) throw err;
	const parsed = CustomerResourceSchema.safeParse(errors.customer);
	if (!parsed.success) throw err;
	return {
		status: shape.status,
		message: shape.message || fallback,
		duplicate: toCustomer(parsed.data)
	};
}

function queryString(params: Record<string, string | number | undefined>): string {
	const qs = new URLSearchParams(
		Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
			if (v !== undefined) acc[k] = String(v);
			return acc;
		}, {})
	).toString();
	return qs ? `?${qs}` : '';
}

export async function getCustomers(params: CustomerFilters = {}): Promise<CustomerPage> {
	const qs = queryString({
		search: params.search,
		sort: params.sort,
		page: params.page,
		per_page: params.perPage
	});
	return toCustomerPage(
		CustomerListResponseSchema.parse(await apiClient.get(`/api/v1/customers${qs}`))
	);
}

export async function getCustomerDetail(id: number): Promise<CustomerDetail> {
	const json = await apiClient.get(`/api/v1/customers/${id}`);
	const parsed = CustomerDetailResponseSchema.parse(json);
	return {
		customer: toCustomer(parsed.data.customer),
		devices: parsed.data.customer.devices.map(toDevice)
	};
}

export async function createCustomer(input: CreateCustomerInput): Promise<Customer> {
	const parsed = CreateCustomerSchema.parse(input);
	try {
		const json = await apiClient.post('/api/v1/customers', parsed);
		const data = (json as { data?: unknown }).data ?? json;
		return toCustomer(CustomerResourceSchema.parse(data));
	} catch (err) {
		throw toDuplicateError(err, 'A customer with this phone number may already exist.');
	}
}

export async function updateCustomer(id: number, input: UpdateCustomerInput): Promise<Customer> {
	const parsed = UpdateCustomerSchema.parse(input);
	try {
		const json = await apiClient.patch(`/api/v1/customers/${id}`, parsed);
		const data = (json as { data?: unknown }).data ?? json;
		return toCustomer(CustomerResourceSchema.parse(data));
	} catch (err) {
		throw toDuplicateError(err, 'Another customer already uses this phone number.');
	}
}

export async function deleteCustomer(id: number): Promise<void> {
	await apiClient.del(`/api/v1/customers/${id}`);
}
