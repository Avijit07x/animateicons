const REQUEST_TYPES = ["icon", "work", "feedback", "other"] as const;
const REQUEST_LIBRARIES = ["lucide", "huge", "either"] as const;

export type RequestType = (typeof REQUEST_TYPES)[number];
export type RequestLibrary = (typeof REQUEST_LIBRARIES)[number];
export type RequestField = "type" | "name" | "email" | "icon" | "message";
export type RequestErrors = Partial<Record<RequestField, string>>;

type RequestData = {
	type: RequestType;
	name: string;
	email: string;
	library: RequestLibrary | "";
	icon: string;
	message: string;
	page: string;
};

export type RequestParse =
	{ ok: true; data: RequestData } | { ok: false; errors: RequestErrors };

export const REQUEST_LIMITS = {
	name: 80,
	email: 254,
	icon: 60,
	message: 2000,
	page: 200,
} as const;

const HIDDEN =
	/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;
const LINE_BREAKS = /[\r\n\t]+/g;
const EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)*\.[a-z]{2,}$/i;

const isOneOf = <T extends string>(
	list: readonly T[],
	value: string,
): value is T => (list as readonly string[]).includes(value);

const read = (value: unknown, max: number, multiline = false): string => {
	if (typeof value !== "string") return "";
	const text = value
		.normalize("NFC")
		.replace(/\r\n?/g, "\n")
		.replace(HIDDEN, "");
	return (multiline ? text : text.replace(LINE_BREAKS, " "))
		.trim()
		.slice(0, max);
};

export const toIconSlug = (value: string): string =>
	value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, REQUEST_LIMITS.icon);

export const parseRequest = (input: Record<string, unknown>): RequestParse => {
	const type = read(input.type, 20);
	const name = read(input.name, REQUEST_LIMITS.name);
	const email = read(input.email, REQUEST_LIMITS.email);
	const icon = toIconSlug(read(input.icon, REQUEST_LIMITS.icon * 2));
	const message = read(input.message, REQUEST_LIMITS.message, true);
	const library = read(input.library, 10);
	const page = read(input.page, REQUEST_LIMITS.page);
	const errors: RequestErrors = {};

	if (!isOneOf(REQUEST_TYPES, type)) errors.type = "Pick what you need.";
	if (!name) errors.name = "Add your name.";
	if (!EMAIL.test(email)) errors.email = "Add a valid email.";
	if (type === "icon" && !icon)
		errors.icon = "Name the icon, like rocket-launch.";
	if (type !== "icon" && message.length < 3)
		errors.message = "Tell me a bit more.";

	if (!isOneOf(REQUEST_TYPES, type) || Object.keys(errors).length > 0) {
		return { ok: false, errors };
	}

	return {
		ok: true,
		data: {
			type,
			name,
			email,
			library:
				type === "icon"
					? isOneOf(REQUEST_LIBRARIES, library)
						? library
						: "either"
					: "",
			icon: type === "icon" ? icon : "",
			message,
			page: /^\/(?![/\\])/.test(page) ? page : "",
		},
	};
};
