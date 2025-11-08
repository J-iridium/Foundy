export function validatePayloadKeys<T extends object>(
	payload: any,
	keys: (keyof T)[]
): asserts payload is T {
	for (const key of keys) {
		if (!payload[key]) {
			throw { status: 403, message: `Invalid token structure (missing ${String(key)})` };
		}
	}
}
