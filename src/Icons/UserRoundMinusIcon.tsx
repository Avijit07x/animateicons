"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface UserRoundMinusHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface UserRoundMinusProps extends HTMLMotionProps<"div"> {
	size?: number;
}

const UserRoundMinusIcon = forwardRef<
	UserRoundMinusHandle,
	UserRoundMinusProps
>(({ onMouseEnter, onMouseLeave, className, size = 28, ...props }, ref) => {
	const controls = useAnimation();
	const isControlled = useRef(false);

	useImperativeHandle(ref, () => {
		isControlled.current = true;
		return {
			startAnimation: () => controls.start("animate"),
			stopAnimation: () => controls.start("normal"),
		};
	});

	const handleEnter = useCallback(() => {
		if (!isControlled.current) controls.start("animate");
	}, [controls]);

	const handleLeave = useCallback(() => {
		if (!isControlled.current) controls.start("normal");
	}, [controls]);

	const bodyVariants: Variants = {
		normal: { strokeDashoffset: 0, opacity: 1 },
		animate: {
			strokeDashoffset: [40, 0],
			opacity: [0.3, 1],
			transition: { duration: 0.7, delay: 0.2, ease: "easeInOut" },
		},
	};

	const headVariants: Variants = {
		normal: { scale: 1, opacity: 1 },
		animate: {
			scale: [0.5, 1.2, 1],
			opacity: [0, 1],
			transition: { duration: 0.6, ease: "easeOut" },
		},
	};

	const minusVariants: Variants = {
		normal: { strokeDashoffset: 0, opacity: 1 },
		animate: {
			strokeDashoffset: [20, 0],
			opacity: [0.4, 1],
			transition: { duration: 0.5, ease: "easeInOut", delay: 0.6 },
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
				className="lucide lucide-user-round-minus-icon lucide-user-round-minus"
			>
				<motion.path
					d="M2 21a8 8 0 0 1 13.292-6"
					strokeDasharray="40"
					strokeDashoffset="40"
					variants={bodyVariants}
					initial="normal"
					animate={controls}
				/>
				<motion.circle
					cx="10"
					cy="8"
					r="5"
					variants={headVariants}
					initial="normal"
					animate={controls}
				/>
				<motion.path
					d="M22 19h-6"
					strokeDasharray="20"
					strokeDashoffset="0"
					variants={minusVariants}
					initial="normal"
					animate={controls}
				/>
			</motion.svg>
		</motion.div>
	);
});

UserRoundMinusIcon.displayName = "UserRoundMinusIcon";
export { UserRoundMinusIcon };
