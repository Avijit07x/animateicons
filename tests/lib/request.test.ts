import { parseRequest, REQUEST_LIMITS, toIconSlug } from "@/lib/request";
import { describe, expect, it } from "vitest";

const ZERO_WIDTH = String.fromCharCode(0x200b);
const RIGHT_TO_LEFT = String.fromCharCode(0x202e);
const NULL_CHAR = String.fromCharCode(0);
const BOM = String.fromCharCode(0xfeff);

const valid = {
	type: "feedback",
	name: "Riya",
	email: "riya@studio.dev",
	message: "Svelte support would be great",
	page: "/icons/lucide",
};

const errorsOf = (input: Record<string, unknown>) => {
	const result = parseRequest(input);
	if (result.ok) throw new Error("expected the request to be rejected");
	return result.errors;
};

const dataOf = (input: Record<string, unknown>) => {
	const result = parseRequest(input);
	if (!result.ok)
		throw new Error(
			`expected a valid request: ${JSON.stringify(result.errors)}`,
		);
	return result.data;
};

describe("parseRequest", () => {
	it("accepts a valid request and trims every field", () => {
		expect(
			dataOf({
				...valid,
				name: "  Riya  ",
				email: " riya@studio.dev ",
				message: "  hello there  ",
			}),
		).toEqual({
			type: "feedback",
			name: "Riya",
			email: "riya@studio.dev",
			library: "",
			icon: "",
			message: "hello there",
			page: "/icons/lucide",
		});
	});

	it.each(["admin", "", "ICON", undefined, 3])(
		"rejects the type %j",
		(type) => {
			expect(errorsOf({ ...valid, type }).type).toBe("Pick what you need.");
		},
	);

	it("requires a name", () => {
		expect(errorsOf({ ...valid, name: "   " }).name).toBe("Add your name.");
	});

	it.each([
		"",
		"riya",
		"riya@studio",
		"riya@studio.d",
		"ri ya@studio.dev",
		"@studio.dev",
		"riya@.dev",
		"riya@studio..dev",
		"riya@@studio.dev",
	])("rejects the email %j", (email) => {
		expect(errorsOf({ ...valid, email }).email).toBe("Add a valid email.");
	});

	it.each(["a@b.co", "first.last+tag@sub.domain.io", "RIYA@STUDIO.DEV"])(
		"accepts the email %j",
		(email) => {
			expect(dataOf({ ...valid, email }).email).toBe(email);
		},
	);

	it("needs an icon name for icon requests and turns it into a slug", () => {
		const data = dataOf({
			...valid,
			type: "icon",
			icon: "  Rocket Launch!! ",
			message: "",
			library: "huge",
		});
		expect(data).toMatchObject({
			type: "icon",
			icon: "rocket-launch",
			library: "huge",
			message: "",
		});
	});

	it("rejects an icon name with no letters or numbers", () => {
		expect(errorsOf({ ...valid, type: "icon", icon: "!!! ---" }).icon).toBe(
			"Name the icon, like rocket-launch.",
		);
	});

	it("needs a message for every other type", () => {
		for (const type of ["work", "feedback", "other"]) {
			expect(errorsOf({ ...valid, type, message: "hi" }).message).toBe(
				"Tell me a bit more.",
			);
		}
	});

	it("drops the icon and library on requests that are not for an icon", () => {
		expect(
			dataOf({ ...valid, type: "work", icon: "rocket", library: "lucide" }),
		).toMatchObject({ icon: "", library: "" });
	});

	it("falls back to either for an unknown library", () => {
		expect(
			dataOf({ ...valid, type: "icon", icon: "rocket", library: "<script>" })
				.library,
		).toBe("either");
	});

	it("caps every field at its limit", () => {
		const data = dataOf({
			...valid,
			type: "icon",
			name: "n".repeat(500),
			icon: "a".repeat(500),
			message: "m".repeat(10_000),
			page: `/${"p".repeat(500)}`,
		});
		expect(data.name).toHaveLength(REQUEST_LIMITS.name);
		expect(data.icon).toHaveLength(REQUEST_LIMITS.icon);
		expect(data.message).toHaveLength(REQUEST_LIMITS.message);
		expect(data.page).toHaveLength(REQUEST_LIMITS.page);
	});

	it("removes control and invisible direction characters", () => {
		const data = dataOf({
			...valid,
			name: `${BOM}Ri${ZERO_WIDTH}ya${RIGHT_TO_LEFT}${NULL_CHAR}`,
			message: `line one${NULL_CHAR}\r\nline ${RIGHT_TO_LEFT}two`,
		});
		expect(data.name).toBe("Riya");
		expect(data.message).toBe("line one\nline two");
	});

	it("keeps single line fields on one line", () => {
		expect(dataOf({ ...valid, name: "Riya\n\tDey" }).name).toBe("Riya Dey");
	});

	it.each([
		"https://evil.example/",
		"javascript:alert(1)",
		"//evil.example",
		"/\\evil.example",
		"icons",
	])("drops the page %j", (page) => {
		expect(dataOf({ ...valid, page }).page).toBe("");
	});

	it("ignores values that are not strings", () => {
		const errors = errorsOf({
			type: "feedback",
			name: 42,
			email: ["riya@studio.dev"],
			message: { text: "hi" },
		});
		expect(errors).toMatchObject({
			name: "Add your name.",
			email: "Add a valid email.",
			message: "Tell me a bit more.",
		});
	});

	it("only returns the known fields, whatever else is sent", () => {
		const data = dataOf({
			...valid,
			secret: "stolen",
			role: "admin",
			__proto__: { admin: true },
		});
		expect(Object.keys(data).sort()).toEqual([
			"email",
			"icon",
			"library",
			"message",
			"name",
			"page",
			"type",
		]);
		expect(({} as Record<string, unknown>).admin).toBeUndefined();
	});
});

describe("toIconSlug", () => {
	it.each([
		["Rocket Launch", "rocket-launch"],
		["  bell--ring  ", "bell-ring"],
		["Café ☕ icon", "caf-icon"],
		["<img src=x>", "img-src-x"],
		["", ""],
	])("turns %j into %j", (input, slug) => {
		expect(toIconSlug(input)).toBe(slug);
	});

	it("never goes over the icon name limit", () => {
		expect(toIconSlug("ab ".repeat(100)).length).toBeLessThanOrEqual(
			REQUEST_LIMITS.icon,
		);
	});
});
