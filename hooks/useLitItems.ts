import type { IconHandle } from "@/types/icon";
import { useCallback, useEffect, useRef } from "react";

type Options = {
	count: number;
	litMs?: number;
	idleEveryMs?: number;
	reach?: number;
	enabled?: boolean;
};

const PICK_ATTEMPTS = 6;

const inView = (el: HTMLElement) => {
	const r = el.getBoundingClientRect();
	return r.width > 0 && r.right > 0 && r.left < window.innerWidth;
};

export const useLitItems = ({
	count,
	litMs = 1100,
	idleEveryMs,
	reach,
	enabled = true,
}: Options) => {
	const fieldRef = useRef<HTMLDivElement | null>(null);
	const itemRefs = useRef<(HTMLElement | null)[]>([]);
	const iconRefs = useRef<(IconHandle | null)[]>([]);
	const lastRef = useRef<number[]>([]);
	const offRef = useRef<ReturnType<typeof setTimeout>[]>([]);
	const visibleRef = useRef(false);

	const setItem = useCallback(
		(i: number) => (el: HTMLElement | null) => {
			itemRefs.current[i] = el;
		},
		[],
	);

	const setIcon = useCallback(
		(i: number) => (handle: IconHandle | null) => {
			iconRefs.current[i] = handle;
		},
		[],
	);

	const light = useCallback(
		(i: number) => {
			const el = itemRefs.current[i];
			if (!el) return;
			el.setAttribute("data-lit", "");
			iconRefs.current[i]?.startAnimation();
			lastRef.current[i] = performance.now();
			clearTimeout(offRef.current[i]);
			offRef.current[i] = setTimeout(
				() => el.removeAttribute("data-lit"),
				litMs,
			);
		},
		[litMs],
	);

	useEffect(() => {
		if (!enabled) return;
		const field = fieldRef.current;
		if (!field) return;
		const offs = offRef.current;

		const io = new IntersectionObserver(
			([entry]) => {
				visibleRef.current = !!entry?.isIntersecting;
			},
			{ threshold: 0.1 },
		);
		io.observe(field);

		const idle = idleEveryMs
			? setInterval(() => {
					if (!visibleRef.current || document.hidden) return;
					for (let attempt = 0; attempt < PICK_ATTEMPTS; attempt++) {
						const i = Math.floor(Math.random() * count);
						const el = itemRefs.current[i];
						if (el && !el.hasAttribute("data-lit") && inView(el)) {
							light(i);
							return;
						}
					}
				}, idleEveryMs)
			: undefined;

		let raf = 0;
		let pos: { x: number; y: number } | null = null;

		const scan = () => {
			raf = 0;
			if (!pos || !reach || !visibleRef.current) return;
			const now = performance.now();
			itemRefs.current.forEach((el, i) => {
				if (!el) return;
				const r = el.getBoundingClientRect();
				if (r.width === 0) return;
				const d = Math.hypot(
					pos!.x - (r.left + r.width / 2),
					pos!.y - (r.top + r.height / 2),
				);
				if (d < reach && now - (lastRef.current[i] ?? 0) > litMs) {
					light(i);
				}
			});
		};

		const onMove = (e: PointerEvent) => {
			pos = { x: e.clientX, y: e.clientY };
			if (!raf) raf = requestAnimationFrame(scan);
		};

		if (reach)
			window.addEventListener("pointermove", onMove, { passive: true });

		return () => {
			window.removeEventListener("pointermove", onMove);
			io.disconnect();
			clearInterval(idle);
			if (raf) cancelAnimationFrame(raf);
			offs.forEach(clearTimeout);
		};
	}, [enabled, count, idleEveryMs, reach, litMs, light]);

	return { fieldRef, visibleRef, setItem, setIcon, light };
};
