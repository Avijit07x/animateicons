import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const client = vi.hoisted(() => ({ ip: "203.0.113.1" }));

vi.mock("next/headers", () => ({
	headers: async () =>
		new Headers({ "x-forwarded-for": `${client.ip}, 10.0.0.1` }),
}));

const WEBHOOK = "https://script.google.com/macros/s/abc123/exec";
const ECHO =
	"https://script.googleusercontent.com/macros/echo?user_content_key=abc";
const SECRET = "s".repeat(48);

const VALID = {
	type: "icon",
	name: "Riya",
	email: "riya@studio.dev",
	icon: "Rocket Launch",
	library: "lucide",
	message: '=HYPERLINK("https://evil.example","click")',
	page: "/icons/lucide",
	website: "",
};

const formOf = (fields: Record<string, string>) => {
	const form = new FormData();
	for (const [key, value] of Object.entries(fields)) form.append(key, value);
	return form;
};

const json = (body: unknown, status = 200) =>
	new Response(typeof body === "string" ? body : JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	});

const redirect = (location = ECHO) =>
	new Response(null, { status: 302, headers: { Location: location } });

type Step = () => Response;

const google = ({
	send = [redirect],
	read = [() => json({ ok: true })],
}: { send?: Step[]; read?: Step[] } = {}) => {
	let sends = 0;
	let reads = 0;
	return vi.fn(async (url: string, init: RequestInit = {}) => {
		if (init.method === "POST")
			return (send[Math.min(sends++, send.length - 1)] ?? redirect)();
		return (
			read[Math.min(reads++, read.length - 1)] ?? (() => json({ ok: true }))
		)();
	});
};

const load = async () => {
	vi.resetModules();
	return (await import("@/actions/submitRequest")).submitRequest;
};

let fetchMock: ReturnType<typeof google>;
let logged: ReturnType<typeof vi.spyOn>;

const use = (mock: ReturnType<typeof google>) => {
	fetchMock = mock;
	vi.stubGlobal("fetch", mock);
};

const posts = () =>
	fetchMock.mock.calls.filter(([, init]) => init?.method === "POST");
const gets = () =>
	fetchMock.mock.calls.filter(([, init]) => init?.method !== "POST");
const sentBody = () => JSON.parse(posts()[0][1]!.body as string);

beforeEach(() => {
	vi.stubEnv("REQUEST_WEBHOOK_URL", WEBHOOK);
	vi.stubEnv("REQUEST_WEBHOOK_SECRET", SECRET);
	client.ip = "203.0.113.1";
	use(google());
	logged = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
});

describe("submitRequest", () => {
	it("posts to the sheet, then reads the reply from Google's redirect", async () => {
		const submit = await load();
		expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
			status: "sent",
		});

		expect(posts()).toHaveLength(1);
		const [url, init] = posts()[0];
		expect(url).toBe(WEBHOOK);
		expect(init).toMatchObject({
			method: "POST",
			cache: "no-store",
			redirect: "manual",
		});
		expect(init!.headers).toEqual({ "Content-Type": "application/json" });
		expect(sentBody()).toEqual({
			secret: SECRET,
			type: "icon",
			name: "Riya",
			email: "riya@studio.dev",
			library: "lucide",
			icon: "rocket-launch",
			message: VALID.message,
			page: "/icons/lucide",
		});

		expect(gets()).toHaveLength(1);
		expect(gets()[0][0]).toBe(ECHO);
		expect(gets()[0][1]).toMatchObject({
			cache: "no-store",
			redirect: "error",
		});
	});

	it("never lets the visitor choose the secret or add fields", async () => {
		const submit = await load();
		await submit(
			{ status: "idle" },
			formOf({ ...VALID, secret: "attacker", role: "admin" }),
		);
		const body = sentBody();
		expect(body.secret).toBe(SECRET);
		expect(body).not.toHaveProperty("role");
		expect(body).not.toHaveProperty("website");
	});

	it("pretends to succeed for bots that fill the hidden field, and sends nothing", async () => {
		const submit = await load();
		expect(
			await submit(
				{ status: "idle" },
				formOf({ ...VALID, website: "https://spam.example" }),
			),
		).toEqual({
			status: "sent",
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it("returns field errors for an invalid request and sends nothing", async () => {
		const submit = await load();
		const state = await submit(
			{ status: "idle" },
			formOf({ ...VALID, email: "nope", name: "" }),
		);
		expect(state).toEqual({
			status: "invalid",
			errors: { name: "Add your name.", email: "Add a valid email." },
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		["no address", undefined, SECRET],
		["no secret", WEBHOOK, undefined],
		["a short secret", WEBHOOK, "short-secret"],
		["plain http", "http://script.google.com/macros/s/abc/exec", SECRET],
		["another host", "https://evil.example/macros/s/abc/exec", SECRET],
		[
			"a look-alike host",
			"https://script.google.com.evil.example/exec",
			SECRET,
		],
		[
			"a host with credentials",
			"https://script.google.com@evil.example/exec",
			SECRET,
		],
		["not a URL", "script.google.com", SECRET],
	])("refuses to send when the setup has %s", async (_case, url, secret) => {
		vi.stubEnv("REQUEST_WEBHOOK_URL", url ?? "");
		vi.stubEnv("REQUEST_WEBHOOK_SECRET", secret ?? "");
		const submit = await load();
		expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
			status: "error",
		});
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each([
		["another site", "https://evil.example/collect"],
		[
			"a look-alike Google host",
			"https://script.googleusercontent.com.evil.example/echo",
		],
		["plain http", "http://script.googleusercontent.com/macros/echo"],
		["a relative path", "/macros/echo"],
	])("never follows a redirect to %s", async (_case, location) => {
		use(google({ send: [() => redirect(location)] }));
		const submit = await load();
		expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
			status: "error",
		});
		expect(gets()).toHaveLength(0);
	});

	it.each([
		["refuses the secret", () => json({ ok: false, error: "unauthorized" })],
		["is busy", () => json({ ok: false, error: "busy" })],
		[
			"answers with an HTML page",
			() => new Response("<html>Sign in</html>", { status: 200 }),
		],
		["answers ok as a string", () => json({ ok: "true" })],
	])("reports an error when the sheet %s", async (_case, reply) => {
		use(google({ read: [reply] }));
		const submit = await load();
		expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
			status: "error",
		});
	});

	it("reads the reply again when Google briefly fails, without sending twice", async () => {
		use(
			google({
				read: [
					() => json({}, 404),
					() => json({}, 500),
					() => json({ ok: true }),
				],
			}),
		);
		const submit = await load();
		expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
			status: "sent",
		});
		expect(posts()).toHaveLength(1);
		expect(gets()).toHaveLength(3);
	});

	it("gives up after three failed reads, still without sending twice", async () => {
		use(google({ read: [() => json({}, 404)] }));
		const submit = await load();
		expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
			status: "error",
		});
		expect(posts()).toHaveLength(1);
		expect(gets()).toHaveLength(3);
	});

	it("sends once more when Google fails before running the script", async () => {
		use(google({ send: [() => json({}, 404), redirect] }));
		const submit = await load();
		expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
			status: "sent",
		});
		expect(posts()).toHaveLength(2);
	});

	it("sends at most twice", async () => {
		use(google({ send: [() => json({}, 503)] }));
		const submit = await load();
		expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
			status: "error",
		});
		expect(posts()).toHaveLength(2);
		expect(gets()).toHaveLength(0);
	});

	it("does not send again after a client error", async () => {
		use(google({ send: [() => json({}, 400)] }));
		const submit = await load();
		expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
			status: "error",
		});
		expect(posts()).toHaveLength(1);
	});

	it("shares one time limit across every step", async () => {
		use(google({ read: [() => json({}, 404), () => json({ ok: true })] }));
		const submit = await load();
		await submit({ status: "idle" }, formOf(VALID));
		const signals = fetchMock.mock.calls.map(([, init]) => init?.signal);
		expect(signals[0]).toBeInstanceOf(AbortSignal);
		expect(new Set(signals).size).toBe(1);
	});

	it.each([
		["the network fails", new TypeError("fetch failed")],
		["the sheet times out", new DOMException("timed out", "TimeoutError")],
	])("reports an error when %s", async (_case, failure) => {
		use(
			vi.fn(async () => {
				throw failure;
			}) as unknown as ReturnType<typeof google>,
		);
		const submit = await load();
		expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
			status: "error",
		});
	});

	it("never writes what the visitor typed, or the secret, to the logs", async () => {
		use(google({ read: [() => json({ ok: false, error: "unauthorized" })] }));
		const submit = await load();
		await submit({ status: "idle" }, formOf(VALID));
		use(
			vi.fn(async () => {
				throw new TypeError(`fetch failed for ${VALID.email}`);
			}) as unknown as ReturnType<typeof google>,
		);
		await submit({ status: "idle" }, formOf(VALID));

		const output = JSON.stringify(logged.mock.calls);
		expect(logged).toHaveBeenCalled();
		for (const value of [
			SECRET,
			VALID.email,
			VALID.name,
			"HYPERLINK",
			WEBHOOK,
			ECHO,
		]) {
			expect(output).not.toContain(value);
		}
	});

	it("allows five requests per visitor every ten minutes", async () => {
		vi.useFakeTimers();
		try {
			const submit = await load();
			for (let i = 0; i < 5; i++) {
				expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
					status: "sent",
				});
			}
			expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
				status: "limited",
			});
			expect(posts()).toHaveLength(5);

			client.ip = "198.51.100.7";
			expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
				status: "sent",
			});

			client.ip = "203.0.113.1";
			vi.advanceTimersByTime(10 * 60 * 1000 + 1);
			expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
				status: "sent",
			});
		} finally {
			vi.useRealTimers();
		}
	});

	it("does not count invalid attempts against the limit", async () => {
		const submit = await load();
		for (let i = 0; i < 10; i++) {
			await submit({ status: "idle" }, formOf({ ...VALID, email: "bad" }));
		}
		expect(await submit({ status: "idle" }, formOf(VALID))).toEqual({
			status: "sent",
		});
	});
});
