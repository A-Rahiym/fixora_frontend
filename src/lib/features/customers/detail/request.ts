import type { CreateQueryOptions, QueryClient } from '@tanstack/svelte-query';
import { deleteCustomer, getCustomerDetail, updateCustomer } from '$lib/api/customers';
import { queryKeys } from '$lib/constants/queryKeys';
import type { UpdateCustomerInput } from '$lib/schemas/customer.schema';
import type { CustomerDetail } from '$lib/schemas/device.schema';

/** TanStack Query options for the customer detail (customer + embedded devices). */
export function customerQueryOptions(id: number): CreateQueryOptions<CustomerDetail> {
	return {
		queryKey: queryKeys.customerDetail(id),
		queryFn: () => getCustomerDetail(id)
	};
}

export function invalidateCustomers(queryClient: QueryClient, id?: number): Promise<void> {
	const jobs: Promise<void>[] = [queryClient.invalidateQueries({ queryKey: queryKeys.customers })];
	if (id !== undefined)
		jobs.push(queryClient.invalidateQueries({ queryKey: queryKeys.customerDetail(id) }));
	return Promise.all(jobs).then(() => undefined);
}

export async function saveCustomer(
	queryClient: QueryClient,
	id: number,
	input: UpdateCustomerInput
): Promise<void> {
	await updateCustomer(id, input);
	await invalidateCustomers(queryClient, id);
}

export async function removeCustomer(queryClient: QueryClient, id: number): Promise<void> {
	await deleteCustomer(id);
	await invalidateCustomers(queryClient);
}
