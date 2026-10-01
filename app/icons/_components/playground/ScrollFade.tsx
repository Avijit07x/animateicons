"use client";

import { useCallback, useEffect, useRef } from "react";

const FADE = "1.5rem";

const MASK =
	"linear-gradient(to right, transparent, #000 var(--fade-start, 0px), #000 calc(100% - var(--fade-end, 0px)), transparent)";

type Props = {
	className?: string;
	children: React.ReactNode;
};

const ScrollFade: React.FC<Props> = ({ className, children }) => {
	const ref = useRef<HTMLDivElement>(null);

	const measure = useCallback(() => {
		const el = ref.current;
		if (!el) return;
		const atStart = el.scrollLeft <= 1;
		const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
		el.style.setProperty("--fade-start", atStart ? "0px" : FADE);
		el.style.setProperty("--fade-end", atEnd ? "0px" : FADE);
	}, []);

	useEffect(() => {
		measure();
	});

	useEffect(() => {
		const el = ref.current;
		if (!el || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(measure);
		observer.observe(el);
		return () => observer.disconnect();
	}, [measure]);

	return (
		<div
			ref={ref}
			onScroll={measure}
			style={{ maskImage: MASK, WebkitMaskImage: MASK }}
			className={`[scrollbar-width:none] overflow-x-auto [&::-webkit-scrollbar]:hidden ${className ?? ""}`}
		>
			{children}
		</div>
	);
};

export default ScrollFade;
