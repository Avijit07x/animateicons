import type { IconHandle } from "@/types/icon";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

export const useIconLoop = <T extends IconHandle = IconHandle>(
	intervalMs: number,
	restartKey?: unknown,
) => {
	const ref = useRef<T | null>(null);
	const reduced = useReducedMotion();

	useEffect(() => {
		if (reduced) return;
		const first = setTimeout(() => ref.current?.startAnimation(), 220);
		const loop = setInterval(() => ref.current?.startAnimation(), intervalMs);
		return () => {
			clearTimeout(first);
			clearInterval(loop);
		};
	}, [reduced, intervalMs, restartKey]);

	return ref;
};
