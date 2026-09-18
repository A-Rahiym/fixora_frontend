import type { CreateQueryOptions } from '@tanstack/svelte-query';
import { getCustomers } from '$lib/api/customers';
import { queryKeys } from '$lib/constants/queryKeys';
import type { CustomerFilters, CustomerPage } from '$lib/schemas/customer.schema';

/** TanStack Query options for the customer list (filters are part of the key). */
export function customersQueryOptions(filters: CustomerFilters): CreateQueryOptions<CustomerPage> {
	return {
		queryKey: queryKeys.customersList({ ...filters }),
		queryFn: () => getCustomers(filters)
	};
}
