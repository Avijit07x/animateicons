"use client";

import { Button } from "@/components/ui/button";
import { PauseIcon } from "@/icons/huge/pause-icon";
import { useReducedMotion } from "motion/react";
import { Dialog } from "radix-ui";
import { useRef, useState, useSyncExternalStore } from "react";

const DISMISSED_KEY = "reduced-motion-dismissed";
const SESSION_KEY = "reduced-motion-seen";

type Platform = "mac" | "ios" | "windows" | "android" | "linux" | "other";

const HOW_TO: Record<Platform, { os: string; path: string[]; action: string }> =
	{
		mac: {
			os: "macOS",
			path: ["System Settings", "Accessibility", "Display"],
			action: "Turn off “Reduce motion”",
		},
		ios: {
			os: "iPhone & iPad",
			path: ["Settings", "Accessibility", "Motion"],
			action: "Turn off “Reduce Motion”",
		},
		windows: {
			os: "Windows",
			path: ["Settings", "Accessibility", "Visual effects"],
			action: "Turn on “Animation effects”",
		},
		android: {
			os: "Android",
			path: ["Settings", "Accessibility"],
			action: "Turn off “Remove animations”",
		},
		linux: {
			os: "Linux",
			path: ["Settings", "Accessibility"],
			action: "Turn animations back on",
		},
		other: {
			os: "your device",
			path: ["Settings", "Accessibility"],
			action: "Turn off “Reduce motion”",
		},
	};

const detectPlatform = (): Platform => {
	const ua = navigator.userAgent;
	if (/iPhone|iPad|iPod/.test(ua)) return "ios";
	if (/Macintosh/.test(ua)) return navigator.maxTouchPoints > 1 ? "ios" : "mac";
	if (/Android/.test(ua)) return "android";
	if (/Windows/.test(ua)) return "windows";
	if (/Linux|X11/.test(ua)) return "linux";
	return "other";
};

const readFlag = (storage: "local" | "session", key: string) => {
	try {
		const store = storage === "local" ? localStorage : sessionStorage;
		return store.getItem(key) === "true";
	} catch {
		return false;
	}
};

const ReducedMotionNotice: React.FC = () => {
	const reduced = useReducedMotion();
	const [closed, setClosed] = useState(false);
	const gotItRef = useRef<HTMLButtonElement | null>(null);

	const hidden = useSyncExternalStore(
		() => () => {},
		() => readFlag("local", DISMISSED_KEY) || readFlag("session", SESSION_KEY),
		() => true,
	);

	const open = !!reduced && !hidden && !closed;

	const close = (forever: boolean) => {
		try {
			if (forever) localStorage.setItem(DISMISSED_KEY, "true");
			else sessionStorage.setItem(SESSION_KEY, "true");
		} catch {}
		setClosed(true);
	};

	if (!open) return null;

	const how = HOW_TO[detectPlatform()];

	return (
		<Dialog.Root
			open
			onOpenChange={(next) => {
				if (!next) close(false);
			}}
		>
			<Dialog.Portal>
				<Dialog.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-100 bg-black/75 backdrop-blur-sm" />
				<Dialog.Content
					onOpenAutoFocus={(e) => {
						e.preventDefault();
						gotItRef.current?.focus();
					}}
					className="bg-surface border-border/60 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed top-1/2 left-1/2 z-101 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-2xl border px-6 pt-8 pb-6 text-center focus:outline-none sm:px-8"
				>
					<span className="bg-warning/10 text-warning ring-warning/5 grid size-20 place-items-center rounded-full ring-8">
						<PauseIcon size={36} />
					</span>

					<Dialog.Title className="text-textPrimary mt-6 text-2xl font-semibold tracking-tight">
						Animations are paused
						<span className="text-primary">.</span>
					</Dialog.Title>
					<Dialog.Description className="text-textSecondary mt-3 text-sm leading-relaxed">
						Your device has Reduce Motion turned on, so every icon here is shown
						at rest instead of animating. That&apos;s AnimateIcons respecting
						your setting. Visitors who use Reduce Motion see the same thing in
						your app.
					</Dialog.Description>

					<div className="bg-surfaceElevated mt-6 w-full rounded-xl p-4 text-left">
						<p className="text-textMuted text-xs font-medium">
							To see the animations on {how.os}
						</p>
						<p className="mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-2">
							{how.path.map((step, k) => (
								<span key={step} className="flex items-center gap-1.5">
									{k > 0 && (
										<span className="text-textMuted text-xs" aria-hidden="true">
											›
										</span>
									)}
									<span className="bg-surface text-textPrimary rounded-full px-2.5 py-1 text-xs font-medium">
										{step}
									</span>
								</span>
							))}
						</p>
						<p className="text-textSecondary mt-3 text-sm">
							{how.action}, then reload this page.
						</p>
					</div>

					<div className="mt-6 flex w-full flex-col-reverse gap-3 sm:flex-row sm:justify-center">
						<Button
							type="button"
							variant="secondary"
							size="pill"
							onClick={() => close(true)}
						>
							Don&apos;t show again
						</Button>
						<Button
							type="button"
							size="pill"
							onClick={() => close(false)}
							ref={gotItRef}
						>
							Got it
						</Button>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default ReducedMotionNotice;
