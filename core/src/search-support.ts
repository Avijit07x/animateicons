export const describeValue = (value: unknown): string => {
	if (typeof value === "string") {
		return JSON.stringify(value.length > 40 ? `${value.slice(0, 40)}…` : value);
	}
	if (typeof value === "function") return "a function";
	if (Array.isArray(value)) return "an array";
	if (value === null) return "null";
	if (typeof value === "object") return "an object";
	if (typeof value === "bigint") return `${value}n`;
	return String(value);
};

export const isObject = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const quoteList = (items: readonly string[]): string => {
	const quoted = items.map((item) => JSON.stringify(item));
	if (quoted.length < 2) return quoted.join("");
	return `${quoted.slice(0, -1).join(", ")} and ${quoted[quoted.length - 1]}`;
};

export const assertString = (
	value: unknown,
	scope: string,
	label: string,
): void => {
	if (typeof value !== "string") {
		throw new TypeError(
			`${scope}: ${label} must be a string, received ${describeValue(value)}.`,
		);
	}
};

export const assertOptions = (
	value: unknown,
	scope: string,
	example: string,
	valid: readonly string[],
): Record<string, unknown> => {
	if (!isObject(value)) {
		throw new TypeError(
			`${scope}: options must be an object like ${example}, received ${describeValue(value)}.`,
		);
	}
	const unknownKey = Object.keys(value).find((key) => !valid.includes(key));
	if (unknownKey !== undefined) {
		throw new TypeError(
			`${scope}: unknown option ${JSON.stringify(unknownKey)}. Valid options are ${quoteList(valid)}.`,
		);
	}
	return value;
};

export const assertLimit = (
	value: unknown,
	scope: string,
	hint?: string,
): void => {
	if (!Number.isInteger(value) || (value as number) < 1) {
		throw new RangeError(
			`${scope}: limit must be a whole number of 1 or more, received ${describeValue(value)}.${hint ? ` ${hint}` : ""}`,
		);
	}
};

export type BoundedCache<V> = {
	get: (key: string) => V | undefined;
	set: (key: string, value: V) => V;
};

export const createBoundedCache = <V>(max: number): BoundedCache<V> => {
	const entries = new Map<string, V>();
	return {
		get: (key) => entries.get(key),
		set: (key, value) => {
			if (!entries.has(key) && entries.size >= max) {
				entries.delete(entries.keys().next().value as string);
			}
			entries.set(key, value);
			return value;
		},
	};
};
