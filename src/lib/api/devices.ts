import { apiClient } from './client';
import { DeviceResourceSchema, toDevice, type Device } from '$lib/schemas/device.schema';

/**
 * Device transport (backend devices endpoints unconfirmed — real errors
 * propagate, screens render error states until the endpoints land).
 */
export async function getCustomerDevices(customerId: number): Promise<Device[]> {
	const json = await apiClient.get(`/api/v1/customers/${customerId}/devices`);
	const data = (json as { data?: unknown }).data ?? json;
	return (Array.isArray(data) ? data : []).map((d) => toDevice(DeviceResourceSchema.parse(d)));
}

export async function getDevices(
	params: { search?: string; page?: number } = {}
): Promise<Device[]> {
	const qs = new URLSearchParams(
		Object.entries(params).reduce<Record<string, string>>((acc, [k, v]) => {
			if (v !== undefined) acc[k] = String(v);
			return acc;
		}, {})
	).toString();
	const json = await apiClient.get(`/api/v1/devices${qs ? `?${qs}` : ''}`);
	const data = (json as { data?: unknown }).data ?? json;
	const list = Array.isArray(data) ? data : ((data as { data?: unknown[] }).data ?? []);
	return (list as unknown[]).map((d) => toDevice(DeviceResourceSchema.parse(d)));
}

export async function getDevice(id: number): Promise<Device> {
	const json = await apiClient.get(`/api/v1/devices/${id}`);
	const data = (json as { data?: unknown }).data ?? json;
	return toDevice(DeviceResourceSchema.parse(data));
}

export async function createDevice(input: {
	customer_id: number;
	category: string;
	brand: string;
	model: string;
	serial_number?: string | null;
	imei?: string | null;
	color?: string | null;
	notes?: string | null;
}): Promise<Device> {
	const json = await apiClient.post('/api/v1/devices', input);
	const data = (json as { data?: unknown }).data ?? json;
	return toDevice(DeviceResourceSchema.parse(data));
}

export async function updateDevice(
	id: number,
	input: Record<string, string | number | null | undefined>
): Promise<Device> {
	const json = await apiClient.patch(`/api/v1/devices/${id}`, input);
	const data = (json as { data?: unknown }).data ?? json;
	return toDevice(DeviceResourceSchema.parse(data));
}

export async function deleteDevice(id: number): Promise<void> {
	await apiClient.del(`/api/v1/devices/${id}`);
}
