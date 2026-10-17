"use server";

import { parseRequest, type RequestErrors } from "@/lib/request";
import { headers } from "next/headers";

export type RequestState =
	| { status: "idle" | "sent" | "limited" | "error" }
	| { status: "invalid"; errors: RequestErrors };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_TRACKED = 5000;
const recent = new Map<string, number[]>();

const allow = (key: string, now: number): boolean => {
	const hits = (recent.get(key) ?? []).filter((at) => now - at < WINDOW_MS);
	if (hits.length >= MAX_PER_WINDOW) {
		recent.set(key, hits);
		return false;
	}
	recent.delete(key);
	recent.set(key, [...hits, now]);
	if (recent.size > MAX_TRACKED) recent.delete(recent.keys().next().value!);
	return true;
};

const webhook = (): { url: string; secret: string } | null => {
	const url = process.env.REQUEST_WEBHOOK_URL;
	const secret = process.env.REQUEST_WEBHOOK_SECRET;
	if (!url || !secret || secret.length < 32) return null;
	try {
		const parsed = new URL(url);
		if (
			parsed.protocol !== "https:" ||
			parsed.hostname !== "script.google.com"
		) {
			return null;
		}
	} catch {
		return null;
	}
	return { url, secret };
};

type SheetReply = { ok?: unknown; error?: unknown } | null;

const REPLY_HOST = "script.googleusercontent.com";
const SEND_ATTEMPTS = 2;
const READ_ATTEMPTS = 3;
const BUDGET_MS = 15_000;

const readReply = async (
	location: string,
	signal: AbortSignal,
): Promise<SheetReply> => {
	for (let attempt = 0; attempt < READ_ATTEMPTS; attempt++) {
		const reply = await fetch(location, {
			cache: "no-store",
			redirect: "error",
			signal,
		});
		if (reply.ok) return reply.json().catch(() => null);
	}
	return null;
};

const deliver = async (url: string, body: string): Promise<SheetReply> => {
	const signal = AbortSignal.timeout(BUDGET_MS);
	for (let attempt = 0; attempt < SEND_ATTEMPTS; attempt++) {
		const sent = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body,
			cache: "no-store",
			redirect: "manual",
			signal,
		});
		if (sent.status >= 300 && sent.status < 400) {
			const location = sent.headers.get("location");
			if (!location || !URL.canParse(location)) return null;
			const next = new URL(location);
			if (next.protocol !== "https:" || next.hostname !== REPLY_HOST)
				return null;
			return readReply(next.href, signal);
		}
		if (sent.ok) return sent.json().catch(() => null);
		if (sent.status !== 404 && sent.status < 500) return null;
	}
	return null;
};

const clientKey = async (): Promise<string> => {
	const list = await headers();
	return (
		list.get("x-forwarded-for")?.split(",")[0]?.trim() ||
		list.get("x-real-ip")?.trim() ||
		"unknown"
	);
};

export async function submitRequest(
	_previous: RequestState,
	form: FormData,
): Promise<RequestState> {
	if (form.get("website")) return { status: "sent" };

	const parsed = parseRequest(Object.fromEntries(form));
	if (!parsed.ok) return { status: "invalid", errors: parsed.errors };

	const target = webhook();
	if (!target) {
		console.error(
			"[submitRequest] REQUEST_WEBHOOK_URL or REQUEST_WEBHOOK_SECRET is missing or invalid",
		);
		return { status: "error" };
	}

	if (!allow(await clientKey(), Date.now())) return { status: "limited" };

	try {
		const reply = await deliver(
			target.url,
			JSON.stringify({ secret: target.secret, ...parsed.data }),
		);
		if (reply?.ok === true) return { status: "sent" };
		console.error("[submitRequest] sheet rejected the request", {
			error: reply?.error ?? "no reply",
		});
	} catch (error) {
		console.error(
			"[submitRequest] could not reach the sheet",
			(error as Error).name,
		);
	}
	return { status: "error" };
}
