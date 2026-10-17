import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

const SOURCE = fs.readFileSync(
	path.join(process.cwd(), "scripts/apps-script/request-form.gs"),
	"utf8",
);
const SECRET = "k".repeat(40);
const HEADERS = [
	"Time",
	"Type",
	"Name",
	"Email",
	"Library",
	"Icon",
	"Message",
	"Page",
];

const VALID = {
	secret: SECRET,
	type: "icon",
	name: "Riya",
	email: "riya@studio.dev",
	library: "lucide",
	icon: "rocket-launch",
	message: "A rocket that lifts off",
	page: "/icons/lucide",
};

type Options = {
	secret?: string | null;
	existing?: boolean;
	locked?: boolean;
	count?: number;
	notify?: string | null;
	mailFails?: boolean;
};

const setup = ({
	secret = SECRET,
	existing = true,
	locked = false,
	count = 0,
	notify = "owner@example.com",
	mailFails = false,
}: Options = {}) => {
	const rows: unknown[][] = [];
	const cache = new Map<string, string>();
	if (count) cache.set("rows-this-minute", String(count));
	const calls: [string, unknown[]][] = [];
	const chain = (): unknown =>
		new Proxy(
			{},
			{
				get:
					(_target, key) =>
					(...args: unknown[]) => {
						calls.push([String(key), args]);
						return chain();
					},
			},
		);
	const sheet = {
		appendRow: (row: unknown[]) => rows.push(row),
		setFrozenRows: vi.fn(),
		setFrozenColumns: vi.fn(),
		showRows: vi.fn(),
		setRowHeight: vi.fn(),
		setColumnWidth: vi.fn(),
		setConditionalFormatRules: vi.fn(),
		getMaxRows: () => 1000,
		getRange: (...args: unknown[]) => {
			calls.push(["getRange", args]);
			return chain();
		},
	};
	const book = {
		getSheetByName: vi.fn(() => (existing ? sheet : null)),
		insertSheet: vi.fn(() => sheet),
		getUrl: () => "https://docs.google.com/spreadsheets/d/sheet-id/edit",
	};
	const sendEmail = vi.fn(() => {
		if (mailFails)
			throw new Error("Service invoked too many times for one day: email.");
	});
	const releaseLock = vi.fn();
	const context = vm.createContext({
		PropertiesService: {
			getScriptProperties: () => ({
				getProperty: (key: string) =>
					key === "SECRET" ? secret : key === "NOTIFY_EMAIL" ? notify : null,
			}),
		},
		LockService: {
			getScriptLock: () => ({ tryLock: () => !locked, releaseLock }),
		},
		CacheService: {
			getScriptCache: () => ({
				get: (key: string) => cache.get(key) ?? null,
				put: (key: string, value: string) => cache.set(key, value),
			}),
		},
		MailApp: { sendEmail, getRemainingDailyQuota: () => 99 },
		console: { error: vi.fn(), log: vi.fn() },
		SpreadsheetApp: {
			getActiveSpreadsheet: () => book,
			newConditionalFormatRule: () => chain(),
			WrapStrategy: { CLIP: "CLIP" },
		},
		ContentService: {
			MimeType: { JSON: "application/json" },
			createTextOutput: (text: string) => ({
				text,
				mime: "",
				setMimeType(mime: string) {
					this.mime = mime;
					return this;
				},
			}),
		},
	});
	vm.runInContext(SOURCE, context);
	const call = (event: unknown) => {
		const output = context.doPost(event) as { text: string; mime: string };
		expect(output.mime).toBe("application/json");
		return JSON.parse(output.text);
	};
	const post = (body: unknown) =>
		call({
			postData: {
				contents: typeof body === "string" ? body : JSON.stringify(body),
			},
		});
	return {
		post,
		call,
		rows,
		book,
		sheet,
		releaseLock,
		context,
		calls,
		sendEmail,
	};
};

describe("request-form.gs", () => {
	it("adds one row in header order when the secret matches", () => {
		const { post, rows, releaseLock } = setup();
		expect(post(VALID)).toEqual({ ok: true });
		expect(rows).toHaveLength(1);
		expect(Object.prototype.toString.call(rows[0][0])).toBe("[object Date]");
		expect(rows[0].slice(1)).toEqual([
			"icon",
			"Riya",
			"riya@studio.dev",
			"lucide",
			"rocket-launch",
			"A rocket that lifts off",
			"/icons/lucide",
		]);
		expect(releaseLock).toHaveBeenCalledTimes(1);
	});

	it.each([
		["a wrong secret", "x".repeat(40)],
		["a secret one character off", `${SECRET.slice(0, -1)}j`],
		["a longer secret", `${SECRET}k`],
		["a shorter secret", SECRET.slice(1)],
		["no secret", undefined],
		["an empty secret", ""],
		["a number", 42],
		["a list", [SECRET]],
		["an object", { toString: () => SECRET }],
	])("refuses %s", (_case, secret) => {
		const { post, rows } = setup();
		expect(post({ ...VALID, secret })).toEqual({
			ok: false,
			error: "unauthorized",
		});
		expect(rows).toHaveLength(0);
	});

	it.each([
		["is not set", null],
		["is empty", ""],
		["is shorter than 32 characters", "short"],
	])("refuses everything while the stored secret %s", (_case, stored) => {
		const { post, rows } = setup({ secret: stored });
		expect(post({ ...VALID, secret: stored ?? "" })).toEqual({
			ok: false,
			error: "unauthorized",
		});
		expect(rows).toHaveLength(0);
	});

	it.each([
		["broken JSON", { postData: { contents: "{not json" } }],
		["an empty body", { postData: { contents: "" } }],
		["a JSON list", { postData: { contents: "[1,2]" } }],
		["a JSON string", { postData: { contents: '"hello"' } }],
		["null", { postData: { contents: "null" } }],
		["no post data", {}],
		["no event", undefined],
	])("rejects %s", (_case, event) => {
		const { call, rows } = setup();
		expect(call(event)).toEqual({ ok: false, error: "bad_request" });
		expect(rows).toHaveLength(0);
	});

	it.each([
		["an unknown type", { type: "admin" }],
		["a missing email", { email: "" }],
		["a missing name", { name: "   " }],
		["a non-string name", { name: ["Riya"] }],
	])("rejects %s", (_case, change) => {
		const { post, rows } = setup();
		expect(post({ ...VALID, ...change })).toEqual({
			ok: false,
			error: "invalid",
		});
		expect(rows).toHaveLength(0);
	});

	it("stores formulas as plain text so the sheet never runs them", () => {
		const { post, rows } = setup();
		post({
			...VALID,
			name: '=IMPORTXML("https://evil.example","//a")',
			email: "+1@studio.dev",
			icon: "-cmd",
			message: "  @SUM(A1:A9)",
			page: '=HYPERLINK("https://evil.example")',
		});
		const [, , name, email, , icon, message, page] = rows[0];
		expect(name).toBe('\'=IMPORTXML("https://evil.example","//a")');
		expect(email).toBe("'+1@studio.dev");
		expect(icon).toBe("'-cmd");
		expect(message).toBe("'@SUM(A1:A9)");
		expect(page).toBe('\'=HYPERLINK("https://evil.example")');
	});

	it("removes invisible characters and caps the length of every cell", () => {
		const zeroWidth = String.fromCharCode(0x200b);
		const flip = String.fromCharCode(0x202e);
		const { post, rows } = setup();
		post({
			...VALID,
			name: `R${zeroWidth}iya${flip}`,
			message: "m".repeat(9000),
			icon: "i".repeat(500),
		});
		const [, , name, , , icon, message] = rows[0];
		expect(name).toBe("Riya");
		expect(message).toHaveLength(2000);
		expect(icon).toHaveLength(60);
	});

	it("writes only the known columns, never the secret", () => {
		const { post, rows } = setup();
		post({ ...VALID, role: "admin", extra: "x" });
		expect(rows[0]).toHaveLength(HEADERS.length);
		expect(rows[0]).not.toContain(SECRET);
	});

	it("turns objects and numbers into empty cells", () => {
		const { post, rows } = setup();
		post({ ...VALID, message: { evil: true }, library: 5 });
		const [, , , , library, , message] = rows[0];
		expect(library).toBe("");
		expect(message).toBe("");
	});

	it("says busy and writes nothing when another request holds the lock", () => {
		const { post, rows, releaseLock } = setup({ locked: true });
		expect(post(VALID)).toEqual({ ok: false, error: "busy" });
		expect(rows).toHaveLength(0);
		expect(releaseLock).not.toHaveBeenCalled();
	});

	it("allows at most 30 rows a minute", () => {
		const { post, rows, releaseLock } = setup({ count: 29 });
		expect(post(VALID)).toEqual({ ok: true });
		expect(post(VALID)).toEqual({ ok: false, error: "busy" });
		expect(rows).toHaveLength(1);
		expect(releaseLock).toHaveBeenCalledTimes(2);
	});

	it("creates the Requests tab with a frozen header row the first time", () => {
		const { post, rows, book, sheet } = setup({ existing: false });
		post(VALID);
		expect(book.insertSheet).toHaveBeenCalledWith("Requests");
		expect(rows[0]).toEqual(HEADERS);
		expect(sheet.setFrozenRows).toHaveBeenCalledWith(1);
		expect(sheet.setColumnWidth).toHaveBeenCalledTimes(HEADERS.length);
		expect(rows).toHaveLength(2);
	});

	it("formats the tab so every column is readable", () => {
		const { context, sheet, calls, rows } = setup();
		context.setupSheet();

		expect(rows).toHaveLength(0);
		expect(sheet.setFrozenRows).toHaveBeenCalledWith(1);
		expect(sheet.setColumnWidth).toHaveBeenCalledTimes(HEADERS.length);
		expect(sheet.setColumnWidth).toHaveBeenCalledWith(7, 440);
		expect(sheet.setFrozenColumns).toHaveBeenCalledWith(0);
		expect(sheet.showRows).toHaveBeenCalledWith(1, 1000);
		expect(calls).toContainEqual(["setValues", [[HEADERS]]]);
		expect(calls).toContainEqual(["setFontWeight", ["bold"]]);
		expect(calls).toContainEqual(["setWrap", [true]]);
		expect(calls).toContainEqual(["setNumberFormat", ["dd mmm yyyy, hh:mm"]]);
		expect(
			calls
				.filter(([name]) => name === "whenTextEqualTo")
				.map(([, args]) => args[0]),
		).toEqual(["icon", "work", "feedback", "other"]);
		expect(sheet.setConditionalFormatRules).toHaveBeenCalledTimes(1);
	});

	it("does not answer GET requests", () => {
		const { context } = setup();
		const output = context.doGet() as { text: string };
		expect(JSON.parse(output.text)).toEqual({
			ok: false,
			error: "method_not_allowed",
		});
	});
});

describe("request emails", () => {
	const mailOf = (sendEmail: ReturnType<typeof vi.fn>) =>
		sendEmail.mock.calls[0][0] as {
			to: string;
			subject: string;
			body: string;
			name: string;
			replyTo?: string;
		};

	it("emails the owner once for every saved request", () => {
		const { post, sendEmail } = setup();
		expect(post(VALID)).toEqual({ ok: true });
		expect(sendEmail).toHaveBeenCalledTimes(1);
		const mail = mailOf(sendEmail);
		expect(mail.to).toBe("owner@example.com");
		expect(JSON.stringify(sendEmail.mock.calls)).not.toContain(
			'"to":"riya@studio.dev"',
		);
		expect(mail.name).toBe("AnimateIcons requests");
		expect(mail.subject).toBe(
			"[AnimateIcons] New icon request from Riya: rocket-launch",
		);
		expect(mail.replyTo).toBe("riya@studio.dev");
		expect(mail.body).toContain("Icon: rocket-launch");
		expect(mail.body).toContain("Library: lucide");
		expect(mail.body).toContain("A rocket that lifts off");
		expect(mail.body).toContain(
			"Sheet: https://docs.google.com/spreadsheets/d/sheet-id/edit",
		);
		expect(mail.body).not.toContain(SECRET);
	});

	it("names other request types plainly and skips icon details", () => {
		const { post, sendEmail } = setup();
		post({ ...VALID, type: "work", icon: "", message: "Thirty icons" });
		const mail = mailOf(sendEmail);
		expect(mail.subject).toBe(
			"[AnimateIcons] New custom work request from Riya",
		);
		expect(mail.body).not.toContain("Icon:");
	});

	it("sends nothing when no address is set", () => {
		const { post, sendEmail, rows } = setup({ notify: null });
		expect(post(VALID)).toEqual({ ok: true });
		expect(rows).toHaveLength(1);
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it.each([
		["a wrong secret", { secret: "x".repeat(40) }],
		["an unknown type", { type: "admin" }],
		["a missing email", { email: "" }],
	])("sends nothing for a refused request with %s", (_case, change) => {
		const { post, sendEmail } = setup();
		post({ ...VALID, ...change });
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it("sends nothing when the sheet is busy", () => {
		const { post, sendEmail } = setup({ count: 30 });
		expect(post(VALID)).toEqual({ ok: false, error: "busy" });
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it("keeps the subject on one line so nobody can add email headers", () => {
		const { post, sendEmail } = setup();
		post({ ...VALID, name: "Riya\r\nBcc: victim@example.com", icon: "x\ny" });
		const mail = mailOf(sendEmail);
		expect(mail.subject).not.toMatch(/[\r\n]/);
		expect(mail.subject).toBe(
			"[AnimateIcons] New icon request from Riya Bcc: victim@example.com: x y",
		);
	});

	it.each([
		"riya@studio.dev, victim@example.com",
		"riya@studio.dev;victim@example.com",
		"Riya <riya@studio.dev>",
		"not-an-email",
	])("does not use %j as the reply address", (email) => {
		const { post, sendEmail } = setup();
		post({ ...VALID, email });
		expect(mailOf(sendEmail).replyTo).toBeUndefined();
	});

	it("still saves the request when the email fails", () => {
		const { post, rows, sendEmail } = setup({ mailFails: true });
		expect(post(VALID)).toEqual({ ok: true });
		expect(rows).toHaveLength(1);
		expect(sendEmail).toHaveBeenCalledTimes(1);
	});

	it("sends the email after releasing the lock", () => {
		const { post, sendEmail, releaseLock } = setup();
		post(VALID);
		expect(releaseLock.mock.invocationCallOrder[0]).toBeLessThan(
			sendEmail.mock.invocationCallOrder[0],
		);
	});

	it("has a test email to check the setup", () => {
		const { context, sendEmail, rows } = setup();
		context.sendTestNotification();
		expect(sendEmail).toHaveBeenCalledTimes(1);
		expect(mailOf(sendEmail).subject).toBe(
			"[AnimateIcons] New icon request from Test notification: rocket-launch",
		);
		expect(rows).toHaveLength(0);
	});

	it("says clearly when the test email has no address to go to", () => {
		const { context, sendEmail } = setup({ notify: null });
		expect(() => context.sendTestNotification()).toThrow(
			"NOTIFY_EMAIL is not set",
		);
		expect(sendEmail).not.toHaveBeenCalled();
	});

	it("lets a failed test email show its real error", () => {
		const { context } = setup({ mailFails: true });
		expect(() => context.sendTestNotification()).toThrow("too many times");
	});
});
