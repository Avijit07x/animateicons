"use client";

import SpecimenFrame from "@/components/home/SpecimenFrame";
import { CirclePause } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Dialog } from "radix-ui";
import { useRef, useState, useSyncExternalStore } from "react";

/**
 * ReducedMotionNotice - a centered dialog shown when the visitor's device has
 * Reduce Motion on, explaining why every icon is at rest and how to turn the
 * setting off on their platform. "Got it" hides it for this visit; "Don't
 * show again" hides it for good. It only fades, since everyone who sees it
 * has asked for less motion.
 */

// Same key the old toast used, so anyone who already dismissed it stays clear.
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

	// Read the stored dismissals SSR-safely (the server assumes dismissed so
	// the dialog never flashes during hydration).
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
		} catch {
			// Storage can be blocked; the dialog still closes for this page.
		}
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
					className="data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed top-1/2 left-1/2 z-101 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 focus:outline-none"
				>
					<SpecimenFrame className="w-full">
						<div className="bg-bgDark">
							<div className="border-border/60 flex items-center justify-between border-b px-5 py-3 font-mono text-[10px] tracking-widest uppercase">
								<span className="text-textMuted">Motion</span>
								<span className="text-warning">Reduced</span>
							</div>

							<div className="px-5 pt-7 pb-6 sm:px-7">
								<span className="border-warning/40 bg-warning/10 text-warning flex size-12 items-center justify-center border">
									<CirclePause className="size-6" />
								</span>

								<Dialog.Title className="text-textPrimary mt-5 text-2xl font-semibold tracking-tight">
									Animations are paused
								</Dialog.Title>
								<Dialog.Description className="text-textSecondary mt-3 text-sm leading-relaxed">
									Your device has Reduce Motion turned on, so every icon here is
									shown at rest instead of animating. That&apos;s AnimateIcons
									respecting your setting. Visitors who use Reduce Motion see
									the same thing in your app.
								</Dialog.Description>

								<div className="border-border/60 mt-6 border">
									<p className="border-border/60 text-textMuted border-b px-4 py-2.5 font-mono text-[10px] tracking-widest uppercase">
										To see the animations on {how.os}
									</p>
									<div className="px-4 py-3.5">
										<p className="text-textPrimary flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs">
											{how.path.map((step, k) => (
												<span key={step} className="flex items-center gap-2">
													{k > 0 && (
														<span className="text-textMuted" aria-hidden="true">
															›
														</span>
													)}
													{step}
												</span>
											))}
										</p>
										<p className="text-textSecondary mt-2 text-sm">
											{how.action}, then reload this page.
										</p>
									</div>
								</div>
							</div>

							<div className="border-border/60 flex flex-col-reverse gap-3 border-t px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
								<button
									type="button"
									onClick={() => close(true)}
									className="btn btn-secondary"
								>
									Don&apos;t show again
								</button>
								<button
									type="button"
									onClick={() => close(false)}
									ref={gotItRef}
									className="btn btn-primary"
								>
									Got it
								</button>
							</div>
						</div>
					</SpecimenFrame>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default ReducedMotionNotice;
