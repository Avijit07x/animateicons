"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import {
	forwardRef,
	useCallback,
	useId,
	useImperativeHandle,
	useRef,
} from "react";
import { cn } from "../../lib/utils";

export interface V0IconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface V0IconProps extends HTMLMotionProps<"div"> {
	size?: number;
	duration?: number;
}

const V0Icon = forwardRef<V0IconHandle, V0IconProps>(
	(
		{
			className,
			size = 28,
			duration = 1,
			onMouseEnter,
			onMouseLeave,
			...props
		},
		ref,
	) => {
		const id = useId();
		const groupControls = useAnimation();
		const leftControls = useAnimation();
		const rightControls = useAnimation();
		const shineControls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						groupControls.start("rest");
						leftControls.start("rest");
						rightControls.start("rest");
						shineControls.start("rest");
					} else {
						groupControls.start("play");
						leftControls.start("play");
						rightControls.start("play");
						shineControls.start("play");
					}
				},
				stopAnimation: () => {
					groupControls.start("rest");
					leftControls.start("rest");
					rightControls.start("rest");
					shineControls.start("rest");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					groupControls.start("play");
					leftControls.start("play");
					rightControls.start("play");
					shineControls.start("play");
				} else onMouseEnter?.(e as any);
			},
			[
				groupControls,
				leftControls,
				rightControls,
				shineControls,
				reduced,
				onMouseEnter,
			],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					groupControls.start("rest");
					leftControls.start("rest");
					rightControls.start("rest");
					shineControls.start("rest");
				} else onMouseLeave?.(e as any);
			},
			[groupControls, leftControls, rightControls, shineControls, onMouseLeave],
		);

		const groupVariants: Variants = {
			rest: { scale: 1, rotate: 0 },
			play: {
				scale: [1, 1.06, 0.98, 1],
				rotate: [0, -1.6, 1.2, 0],
				transition: { duration: 0.9 * duration, ease: [0.22, 0.9, 0.32, 1] },
			},
		};

		const leftVariants: Variants = {
			rest: {
				opacity: 1,
				scale: 1,
				x: 0,
				rotate: 0,
				transformOrigin: "left center",
			},
			play: {
				opacity: [0, 1],
				scale: [0.5, 1.08, 0.98, 1],
				x: [-18, 8, -4, 0],
				rotate: [-10, 6, -3, 0],
				transition: { duration: 1.1 * duration, ease: "easeOut", delay: 0.02 },
			},
		};

		const rightVariants: Variants = {
			rest: {
				opacity: 1,
				scale: 1,
				x: 0,
				rotate: 0,
				transformOrigin: "right center",
			},
			play: {
				opacity: [0, 1],
				scale: [0.5, 1.08, 0.98, 1],
				x: [18, -8, 4, 0],
				rotate: [10, -6, 3, 0],
				transition: { duration: 1.1 * duration, ease: "easeOut", delay: 0.12 },
			},
		};

		const shineVariants: Variants = {
			rest: { x: "-40%", opacity: 0 },
			play: {
				x: ["-40%", "140%"],
				opacity: [0, 0.28, 0],
				transition: reduced
					? { duration: 0.1 }
					: {
							duration: 1.6 * duration,
							ease: "easeInOut",
							repeat: 0,
							delay: 0.18,
						},
			},
		};

		return (
			<motion.div
				className={cn("inline-flex items-center justify-center", className)}
				style={{ width: size, height: size * (70 / 147) }}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				initial="rest"
				animate={groupControls}
				variants={groupVariants}
				{...props}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 147 70"
					aria-hidden="true"
					className="h-full w-full"
				>
					<defs>
						<linearGradient id={`${id}-g`} x1="0" x2="1" y1="0" y2="0">
							<stop offset="0%" stopColor="rgba(255,255,255,0)" />
							<stop offset="40%" stopColor="rgba(255,255,255,0.6)" />
							<stop offset="60%" stopColor="rgba(255,255,255,0.2)" />
							<stop offset="100%" stopColor="rgba(255,255,255,0)" />
						</linearGradient>
					</defs>

					<motion.g
						initial="rest"
						animate={leftControls}
						variants={leftVariants}
					>
						<motion.path
							d="M56 50.2031V14H70V60.1562C70 65.5928 65.5928 70 60.1562 70C57.5605 70 54.9982 68.9992 53.1562 67.1573L0 14H19.7969L56 50.2031Z"
							fill="currentColor"
						/>
					</motion.g>

					<motion.g
						initial="rest"
						animate={rightControls}
						variants={rightVariants}
					>
						<motion.path
							d="M147 56H133V23.9531L100.953 56H133V70H96.6875C85.8144 70 77 61.1856 77 50.3125V14H91V46.1562L123.156 14H91V0H127.312C138.186 0 147 8.81439 147 19.6875V56Z"
							fill="currentColor"
						/>
					</motion.g>

					<motion.rect
						initial="rest"
						animate={shineControls}
						variants={shineVariants}
						x="-60"
						y="-10"
						width="80"
						height="90"
						fill={`url(#${id}-g)`}
						opacity={0.28}
						transform="rotate(-18)"
					/>
				</svg>
			</motion.div>
		);
	},
);

V0Icon.displayName = "V0Icon";
export { V0Icon };
