"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface CircleChevronLeftIconHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface CircleChevronLeftIconProps extends HTMLMotionProps<"div"> {
	size?: number;
	durationMultiplier?: number;
}

const CircleChevronLeftIcon = forwardRef<
	CircleChevronLeftIconHandle,
	CircleChevronLeftIconProps
>(({ onMouseEnter, onMouseLeave, className, size = 28, durationMultiplier = 1, ...props }, ref) => {
	const circleControls = useAnimation();
	const arrowControls = useAnimation();
	const isControlled = useRef(false);
	const tickControls = useAnimation();
	const reduced = useReducedMotion();

	useImperativeHandle(ref, () => {
		isControlled.current = true;
		return {
			startAnimation: () => {
				if (reduced) {
					circleControls.start("normal");
					tickControls.start("normal");
					arrowControls.start("normal");
				} else {
					circleControls.start("animate");
					tickControls.start("animate");
					arrowControls.start("animate");
				}
			},
			stopAnimation: () => {
				circleControls.start("normal");
				tickControls.start("normal");
				arrowControls.start("normal");
			},
		};
	});

	const handleEnter = useCallback(
		(e?: React.MouseEvent<HTMLDivElement>) => {
			if (reduced) return;
			if (!isControlled.current) {
				circleControls.start("animate");
				tickControls.start("animate");
				arrowControls.start("animate");
			} else {
				onMouseEnter?.(e as any);
			}
		},
		[circleControls, tickControls, reduced, onMouseEnter],
	);

	const handleLeave = useCallback(
		(e?: React.MouseEvent<HTMLDivElement>) => {
			if (!isControlled.current) {
				circleControls.start("normal");
				tickControls.start("normal");
				arrowControls.start("normal");
			} else {
				onMouseLeave?.(e as any);
			}
		},
		[circleControls, tickControls, onMouseLeave],
	);

	const circleVariants: Variants = {
		normal: { scale: 1, opacity: 1 },
		animate: {
			scale: [1, 1.08, 0.95, 1],
			transition: {
				duration: 0.8 * durationMultiplier,
				ease: "easeInOut",
			},
		},
	};

	const arrowVariants: Variants = {
		normal: { x: 0, opacity: 1 },
		animate: {
			x: [-8, 0, -2, 0],
			opacity: 1,
			transition: {
				duration: 0.9 * durationMultiplier,
				ease: "easeOut",
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
			>
				<motion.circle
					cx="12"
					cy="12"
					r="10"
					animate={circleControls}
					initial="normal"
					variants={circleVariants}
				/>
				<motion.path
					d="m14 16-4-4 4-4"
					animate={arrowControls}
					initial="normal"
					variants={arrowVariants}
				/>
			</motion.svg>
		</motion.div>
	);
});

CircleChevronLeftIcon.displayName = "CircleChevronLeftIcon";
export { CircleChevronLeftIcon };
