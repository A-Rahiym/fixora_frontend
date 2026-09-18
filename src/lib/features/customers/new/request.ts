import type { QueryClient } from '@tanstack/svelte-query';
import { createCustomer, type DuplicateCustomerError } from '$lib/api/customers';
import { queryKeys } from '$lib/constants/queryKeys';
import { CreateCustomerSchema, type CreateCustomerInput } from '$lib/schemas/customer.schema';

export interface CreateResult {
	ok: boolean;
	id?: number;
	error?: string;
	fieldErrors?: Partial<Record<'name' | 'phone' | 'email' | 'address' | 'notes', string>>;
	duplicate?: { id: number; name: string; phone: string };
}

/** Screen feature: validate → create. Duplicate phones return the existing record. */
export async function submitCustomer(
	queryClient: QueryClient,
	input: CreateCustomerInput
): Promise<CreateResult> {
	const parsed = CreateCustomerSchema.safeParse(input);
	if (!parsed.success) {
		const flat = parsed.error.flatten().fieldErrors;
		return {
			ok: false,
			fieldErrors: {
				name: flat.name?.[0],
				phone: flat.phone?.[0],
				email: flat.email?.[0],
				address: flat.address?.[0],
				notes: flat.notes?.[0]
			}
		};
	}
	try {
		const created = await createCustomer(parsed.data);
		await queryClient.invalidateQueries({ queryKey: queryKeys.customers });
		await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
		return { ok: true, id: created.id };
	} catch (err) {
		const dup = err as DuplicateCustomerError;
		if (dup && typeof dup.status === 'number' && dup.duplicate) {
			return {
				ok: false,
				error: dup.message || 'A customer with this phone number may already exist.',
				duplicate: { id: dup.duplicate.id, name: dup.duplicate.name, phone: dup.duplicate.phone }
			};
		}
		const message =
			err && typeof err === 'object' && 'message' in err
				? String((err as { message: unknown }).message)
				: 'Could not create the customer.';
		return { ok: false, error: message };
	}
}
