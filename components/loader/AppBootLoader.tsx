"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LoaderVisual } from "./LoaderVisual";

/**
 * Full-screen boot splash shown on every full page load / refresh. It is
 * server-rendered into the initial HTML (so it paints before hydration, with
 * no flash of unstyled content), then fades out once the document has finished
 * loading - with a short minimum on-screen time so it never flickers.
 *
 * Client-side route changes are covered separately by app/loading.tsx; this
 * overlay lives in the root layout and does not remount on navigation.
 */
const MIN_VISIBLE_MS = 650;
const SAFETY_MS = 4000;
const FADE_MS = 500;

export function AppBootLoader() {
	const [fading, setFading] = useState(false);
	const [gone, setGone] = useState(false);

	useEffect(() => {
		const start = performance.now();
		let fadeTimer: number;

		const finish = () => {
			const elapsed = performance.now() - start;
			fadeTimer = window.setTimeout(
				() => setFading(true),
				Math.max(0, MIN_VISIBLE_MS - elapsed),
			);
		};

		let safety: number;
		if (document.readyState === "complete") {
			finish();
		} else {
			window.addEventListener("load", finish, { once: true });
			safety = window.setTimeout(finish, SAFETY_MS);
		}

		return () => {
			window.removeEventListener("load", finish);
			window.clearTimeout(fadeTimer);
			window.clearTimeout(safety);
		};
	}, []);

	useEffect(() => {
		if (!fading) return;
		const id = window.setTimeout(() => setGone(true), FADE_MS);
		return () => window.clearTimeout(id);
	}, [fading]);

	if (gone) return null;

	return (
		<div
			aria-hidden="true"
			className={cn(
				"bg-bgDark fixed inset-0 z-100 flex items-center justify-center transition-opacity ease-out",
				fading ? "pointer-events-none opacity-0" : "opacity-100",
			)}
			style={{ transitionDuration: `${FADE_MS}ms` }}
		>
			<LoaderVisual />
		</div>
	);
}
