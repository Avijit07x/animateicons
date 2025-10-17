"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BitcoinIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface BitcoinIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const BitcoinIcon = forwardRef<BitcoinIconHandle, BitcoinIconProps>(
	({ onMouseEnter, onMouseLeave, className, size = 28, durationMultiplier = 1, ...props }, ref) => {
		const controls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () =>
					reduced ? controls.start("normal") : controls.start("animate"),
				stopAnimation: () => controls.start("normal"),
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) controls.start("animate");
				else onMouseEnter?.(e as any);
			},
			[controls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) controls.start("normal");
				else onMouseLeave?.(e as any);
			},
			[controls, onMouseLeave],
		);

		const groupSway: Variants = {
			normal: { scale: 1, rotate: 0, y: 0 },
			animate: {
				scale: [1, 1.055, 1],
				rotate: [0, -2, 2, 0],
				y: [0, -1, 0],
				transition: { duration: 0.9 * durationMultiplier, ease: "easeInOut" },
			},
		};

		const drawStroke = (delay: number, dur = 0.6): Variants => ({
			normal: { pathLength: 0, opacity: 1 },
			animate: {
				pathLength: 1,
				opacity: 1,
				transition: { duration: dur, ease: "easeInOut", delay },
			},
		});

		const spark = (delay: number): Variants => ({
			normal: { scale: 0.6, opacity: 0 },
			animate: {
				scale: [0.6, 1.25, 1],
				opacity: [0, 0.9, 0],
				transition: { duration: 0.35 * durationMultiplier, ease: "easeOut", delay },
			},
		});

		return (
			<motion.div
				className={cn("inline-flex items-center justify-center", className)}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				{...props}
			>
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="lucide lucide-bitcoin-icon lucide-bitcoin"
				>
					<motion.g variants={groupSway} initial="normal" animate={controls}>
						<g>
							<path d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894" />
							<path d="M10.551 19.089L5.86 18.047" />
							<path d="M10.551 19.089l-.347 1.97" />
							<path d="M12.114 12.195c4.924.869 6.14-6.025 1.215-6.893" />
							<path d="M12.114 12.195l-3.94-.694" />
							<path d="M13.329 5.301L8.29 4.26" />
							<path d="M14.198 5.302l.348-1.97" />
							<path d="M7.48 20.364l3.126-17.727" />
						</g>

						<motion.path
							d="M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894"
							pathLength={1}
							variants={drawStroke(0.06, 0.55)}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="M10.551 19.089L5.86 18.047"
							pathLength={1}
							variants={drawStroke(0.12, 0.45)}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="M10.551 19.089l-.347 1.97"
							pathLength={1}
							variants={drawStroke(0.18, 0.4)}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="M12.114 12.195c4.924.869 6.14-6.025 1.215-6.893"
							pathLength={1}
							variants={drawStroke(0.26, 0.6)}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="M12.114 12.195l-3.94-.694"
							pathLength={1}
							variants={drawStroke(0.32, 0.45)}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="M13.329 5.301L8.29 4.26"
							pathLength={1}
							variants={drawStroke(0.4, 0.45)}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="M14.198 5.302l.348-1.97"
							pathLength={1}
							variants={drawStroke(0.46, 0.4)}
							initial="normal"
							animate={controls}
						/>
						<motion.path
							d="M7.48 20.364l3.126-17.727"
							pathLength={1}
							variants={drawStroke(0.54, 0.75)}
							initial="normal"
							animate={controls}
						/>

						<motion.circle
							cx="12.2"
							cy="12.2"
							r="0.9"
							fill="currentColor"
							variants={spark(0.28)}
							initial="normal"
							animate={controls}
						/>
						<motion.circle
							cx="10.6"
							cy="19.1"
							r="0.8"
							fill="currentColor"
							variants={spark(0.16)}
							initial="normal"
							animate={controls}
						/>
						<motion.circle
							cx="14.3"
							cy="5.3"
							r="0.7"
							fill="currentColor"
							variants={spark(0.48)}
							initial="normal"
							animate={controls}
						/>
					</motion.g>
				</motion.svg>
			</motion.div>
		);
	},
);

BitcoinIcon.displayName = "BitcoinIcon";
export { BitcoinIcon };
