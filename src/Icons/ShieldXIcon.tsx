"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const ShieldXIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 28, speed = 1, ...props },
		ref,
	) => {
		const shieldControls = useAnimation();
		const x1Controls = useAnimation();
		const x2Controls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						shieldControls.start("normal");
						x1Controls.start("normal");
						x2Controls.start("normal");
					} else {
						shieldControls.start("animate");
						x1Controls.start("animate");
						x2Controls.start("animate");
					}
				},
				stopAnimation: () => {
					shieldControls.start("normal");
					x1Controls.start("normal");
					x2Controls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					shieldControls.start("animate");
					x1Controls.start("animate");
					x2Controls.start("animate");
				} else onMouseEnter?.(e as any);
			},
			[shieldControls, x1Controls, x2Controls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					shieldControls.start("normal");
					x1Controls.start("normal");
					x2Controls.start("normal");
				} else onMouseLeave?.(e as any);
			},
			[shieldControls, x1Controls, x2Controls, onMouseLeave],
		);

		const shieldVariants: Variants = {
			normal: { strokeDashoffset: 0, scale: 1, rotate: 0 },
			animate: {
				strokeDashoffset: [300, 24, 0],
				scale: [1, 0.98, 1.04, 1],
				rotate: [0, -2, 1, 0],
				transition: {
					duration: 1.0 * speed,
					ease: [0.18, 0.85, 0.25, 1],
					times: [0, 0.35, 0.75, 1],
				},
			},
		};

		const x1Variants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [40, 0],
				opacity: [0, 1],
				transition: {
					duration: 0.5 * speed,
					ease: [0.22, 0.9, 0.28, 1],
					delay: 0.28,
				},
			},
		};

		const x2Variants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [40, 0],
				opacity: [0, 1],
				transition: {
					duration: 0.5 * speed,
					ease: [0.22, 0.9, 0.28, 1],
					delay: 0.36,
				},
			},
		};

		return (
			<motion.div
				className={cn("inline-flex items-center justify-center", className)}
				onMouseEnter={handleEnter}
				onMouseLeave={handleLeave}
				{...props}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width={size}
					height={size}
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<motion.path
						d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
						initial="normal"
						animate={shieldControls}
						variants={shieldVariants}
						style={{ strokeDasharray: 300, transformOrigin: "12px 12px" }}
					/>
					<motion.path
						d="m14.5 9.5-5 5"
						initial="normal"
						animate={x1Controls}
						variants={x1Variants}
						style={{ strokeDasharray: 40, strokeLinecap: "round" }}
					/>
					<motion.path
						d="m9.5 9.5 5 5"
						initial="normal"
						animate={x2Controls}
						variants={x2Variants}
						style={{ strokeDasharray: 40, strokeLinecap: "round" }}
					/>
				</svg>
			</motion.div>
		);
	},
);

ShieldXIcon.displayName = "ShieldXIcon";
const icon = withAnimatedIconWrapper(ShieldXIcon);
export { icon as ShieldXIcon };
