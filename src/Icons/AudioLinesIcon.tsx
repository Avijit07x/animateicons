"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const AudioLinesIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
		ref,
	) => {
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
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					controls.start("normal");
				} else {
					onMouseLeave?.(e as any);
				}
			},
			[controls, onMouseLeave],
		);

		const barVariants: Variants = {
			normal: { scaleY: 1, opacity: 1 },
			animate: (i: number) => ({
				scaleY: [1, 1.4, 0.6, 1],
				opacity: [1, 0.8, 1],
				transition: {
					duration: 0.9 * speed,
					repeat: 0,
					delay: i * 0.2,
					ease: "easeInOut",
				},
			}),
		};

		const paths = [
			"M2 10v3",
			"M6 6v11",
			"M10 3v18",
			"M14 8v7",
			"M18 5v13",
			"M22 10v3",
		];

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
					animate={controls}
					initial="normal"
				>
					{paths.map((d, i) => (
						<motion.path
							key={i}
							d={d}
							variants={barVariants}
							custom={i}
							style={{ originY: 0.5 }}
						/>
					))}
				</motion.svg>
			</motion.div>
		);
	},
);

AudioLinesIcon.displayName = "AudioLinesIcon";
const icon = withAnimatedIconWrapper(AudioLinesIcon);
export { icon as AudioLinesIcon };
