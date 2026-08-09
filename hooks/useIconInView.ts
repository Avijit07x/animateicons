"use client";

import type { IconHandle } from "@/types/icon";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * useIconInView - play an AnimateIcons icon when it scrolls into view.
 *
 * The landing page's core trick: instead of waiting for a hover that may
 * never come, every showcased icon fires its own semantic animation the
 * moment it enters the viewport (and optionally re-loops while visible).
 * Returns a wrapper ref to observe and an icon ref to attach to the icon.
 * No-ops under prefers-reduced-motion.
 *
 *   const { wrapRef, iconRef } = useIconInView({ loop: true });
 *   <div ref={wrapRef}><BellRingIcon ref={iconRef} /></div>
 */

type Options = {
	/** Keep replaying at `loopMs` while the icon stays in view. */
	loop?: boolean;
	loopMs?: number;
	/** Delay the first play (ms) - use to stagger a row of icons. */
	delay?: number;
	rootMargin?: string;
};

export function useIconInView<T extends HTMLElement = HTMLDivElement>(
	options: Options = {},
) {
	const {
		loop = false,
		loopMs = 5000,
		delay = 0,
		rootMargin = "0px 0px -10% 0px",
	} = options;
	const reduced = useReducedMotion();
	const wrapRef = useRef<T | null>(null);
	const iconRef = useRef<IconHandle | null>(null);

	useEffect(() => {
		if (reduced) return;
		const el = wrapRef.current;
		if (!el) return;

		let interval: ReturnType<typeof setInterval> | undefined;
		let startTimer: ReturnType<typeof setTimeout> | undefined;

		const io = new IntersectionObserver(
			([entry]) => {
				if (entry?.isIntersecting) {
					startTimer = setTimeout(() => {
						iconRef.current?.startAnimation();
						if (loop) {
							interval = setInterval(
								() => iconRef.current?.startAnimation(),
								loopMs,
							);
						}
					}, delay);
					if (!loop) io.disconnect();
				} else if (interval) {
					clearInterval(interval);
					interval = undefined;
				}
			},
			{ rootMargin, threshold: 0.25 },
		);

		io.observe(el);
		return () => {
			io.disconnect();
			if (interval) clearInterval(interval);
			if (startTimer) clearTimeout(startTimer);
		};
	}, [reduced, loop, loopMs, delay, rootMargin]);

	return { wrapRef, iconRef };
}
