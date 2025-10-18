"use client";

import { withAnimatedIconWrapper } from "@/components/AnimatedIconsWrapper";
import { cn } from "@/lib/utils";
import { AnimatedIconProps, AnimatedIconRef } from "@/types";
import type { Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const XIcon = forwardRef<AnimatedIconRef, AnimatedIconProps>(
	(
		{ onMouseEnter, onMouseLeave, className, size = 24, speed = 1, ...props },
		ref,
	) => {
		const svgControls = useAnimation();
		const path1Controls = useAnimation();
		const path2Controls = useAnimation();
		const reduced = useReducedMotion();
		const isControlled = useRef(false);

		useImperativeHandle(ref, () => {
			isControlled.current = true;
			return {
				startAnimation: () => {
					if (reduced) {
						svgControls.start("normal");
						path1Controls.start("normal");
						path2Controls.start("normal");
					} else {
						svgControls.start("animate");
						path1Controls.start("animate");
						path2Controls.start("animate");
					}
				},
				stopAnimation: () => {
					svgControls.start("normal");
					path1Controls.start("normal");
					path2Controls.start("normal");
				},
			};
		});

		const handleEnter = useCallback(
			(e?: React.MouseEvent<HTMLDivElement>) => {
				if (reduced) return;
				if (!isControlled.current) {
					svgControls.start("animate");
					path1Controls.start("animate");
					path2Controls.start("animate");
				} else {
					onMouseEnter?.(e as any);
				}
			},
			[svgControls, path1Controls, path2Controls, reduced, onMouseEnter],
		);

		const handleLeave = useCallback(
			(e: React.MouseEvent<HTMLDivElement>) => {
				if (!isControlled.current) {
					svgControls.start("normal");
					path1Controls.start("normal");
					path2Controls.start("normal");
				} else {
					onMouseLeave?.(e);
				}
			},
			[svgControls, path1Controls, path2Controls, onMouseLeave],
		);

		const svgVariants: Variants = {
			normal: {
				rotate: 0,
				scale: 1,
				transition: { duration: 0.3 * speed },
			},
			animate: {
				rotate: [0, 15, -15, 0],
				scale: [1, 1.1, 1],
				transition: { duration: 0.6 * speed },
			},
		};

		const pathVariants: Variants = {
			normal: { pathLength: 1, opacity: 1 },
			animate: {
				pathLength: [0, 1],
				opacity: [0, 1],
				transition: { duration: 0.6 * speed, ease: "easeInOut" },
			},
		};

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
					variants={svgVariants}
					initial="normal"
					animate={svgControls}
				>
					<motion.path
						d="M18 6 6 18"
						variants={pathVariants}
						initial="normal"
						animate={path1Controls}
					/>
					<motion.path
						d="m6 6 12 12"
						variants={pathVariants}
						initial="normal"
						animate={path2Controls}
						transition={{ delay: 0.2 }}
					/>
				</motion.svg>
			</motion.div>
		);
	},
);

XIcon.displayName = "XIcon";
const icon = withAnimatedIconWrapper(XIcon);
export { icon as XIcon };
