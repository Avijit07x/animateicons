"use client";

import { useIconLoop } from "@/hooks/useIconLoop";
import Logo from "../logo/Logo";

const LOOP_MS = 1500;

export function LoaderVisual() {
	const logoRef = useIconLoop(LOOP_MS);

	return (
		<div className="flex flex-col items-center gap-5">
			<Logo ref={logoRef} size={40} duration={0.6} className="loader-logo" />
			<div className="relative h-[3px] w-52 overflow-hidden rounded-full bg-white/10">
				<div className="loader-bar absolute inset-y-0 left-0 w-1/3 rounded-full bg-white/90" />
			</div>
		</div>
	);
}
