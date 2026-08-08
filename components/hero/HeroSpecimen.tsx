"use client";

import { BellRingIcon } from "@/icons/lucide/bell-ring-icon";
import { EyeIcon } from "@/icons/lucide/eye-icon";
import { LaptopMinimalIcon } from "@/icons/lucide/laptop-minimal-icon";
import { RadioIcon } from "@/icons/lucide/radio-icon";
import { SunMediumIcon } from "@/icons/lucide/sun-medium-icon";
import { WaypointsIcon } from "@/icons/lucide/waypoints-icon";
import SpecimenFrame from "@/components/home/SpecimenFrame";
import type { IconHandle } from "@/types/icon";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * HeroSpecimen - the hero's centerpiece: one large icon presented like a
 * museum/type specimen. Registration crop-marks frame it, monospace labels
 * annotate it, and it auto-cycles + replays its animation. Holds a single
 * static icon under prefers-reduced-motion.
 */

type SpotIcon = React.ComponentType<{
	size?: number;
	ref?: React.Ref<IconHandle>;
}>;

const SPECIMENS = [
	{ Icon: BellRingIcon, name: "bell-ring", note: "pendulum swing" },
	{ Icon: LaptopMinimalIcon, name: "laptop-minimal", note: "screen wake" },
	{ Icon: EyeIcon, name: "eye", note: "blink + scan" },
	{ Icon: SunMediumIcon, name: "sun-medium", note: "ray radiate" },
	{ Icon: WaypointsIcon, name: "waypoints", note: "route draw" },
	{ Icon: RadioIcon, name: "radio", note: "signal broadcast" },
] as unknown as { Icon: SpotIcon; name: string; note: string }[];

const REST_MS = 600;
const PLAY_GAP_MS = 1500;

const HeroSpecimen: React.FC = () => {
	const reduced = useReducedMotion();
	const [i, setI] = useState(0);
	const iconRef = useRef<IconHandle | null>(null);
	const cur = SPECIMENS[i];

	// Per icon: rest (show it still) -> play -> play again fully -> next -> repeat.
	useEffect(() => {
		if (reduced) return;
		const timers = [
			setTimeout(() => iconRef.current?.startAnimation(), REST_MS),
			setTimeout(
				() => iconRef.current?.startAnimation(),
				REST_MS + PLAY_GAP_MS,
			),
			setTimeout(
				() => setI((v) => (v + 1) % SPECIMENS.length),
				REST_MS + 2 * PLAY_GAP_MS,
			),
		];
		return () => timers.forEach(clearTimeout);
	}, [i, reduced]);

	return (
		<SpecimenFrame
			label="Specimen"
			index={`${String(i + 1).padStart(3, "0")}/${String(SPECIMENS.length).padStart(3, "0")}`}
			footLeft={cur.name}
			footRight={cur.note}
			crosshair
			className="mx-auto w-full max-w-md select-none"
		>
			<div className="text-primary flex aspect-square w-full items-center justify-center">
				{reduced ? (
					<cur.Icon size={140} />
				) : (
					<AnimatePresence mode="wait">
						<motion.span
							key={cur.name}
							initial={{ opacity: 0, scale: 0.97 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.99 }}
							transition={{ duration: 0.26, ease: "easeOut" }}
						>
							<cur.Icon ref={iconRef} size={140} />
						</motion.span>
					</AnimatePresence>
				)}
			</div>
		</SpecimenFrame>
	);
};

export default HeroSpecimen;
