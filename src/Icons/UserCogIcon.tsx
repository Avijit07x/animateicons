"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface UserCogHandle {
	startAnimation: () => void;
	stopAnimation: () => void;
}

interface UserCogProps extends HTMLMotionProps<"div"> {
	size?: number;
}

const UserCogIcon = forwardRef<UserCogHandle, UserCogProps>(
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

		const bodyVariants: Variants = {
			normal: { strokeDashoffset: 0, opacity: 1 },
			animate: {
				strokeDashoffset: [40, 0],
				opacity: [0.3, 1],
				transition: { duration: 0.7 * durationMultiplier, ease: "easeInOut" },
			},
		};

		const headVariants: Variants = {
			normal: { scale: 1, opacity: 1 },
			animate: {
				scale: [0.5, 1.2, 1],
				opacity: [0, 1],
				transition: { duration: 0.6 * durationMultiplier, ease: "easeOut" },
			},
		};

		const cogCircleVariants: Variants = {
			normal: { rotate: 0, scale: 1, opacity: 1 },
			animate: {
				rotate: 360,
				scale: [0.8, 1.1, 1],
				opacity: 1,
				transition: { duration: 1 * durationMultiplier, ease: "easeInOut" },
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
					className="lucide lucide-user-cog-icon lucide-user-cog"
				>
					<motion.path
						d="M10 15H6a4 4 0 0 0-4 4v2"
						strokeDasharray="40"
						strokeDashoffset="40"
						variants={bodyVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.circle
						cx="9"
						cy="7"
						r="4"
						variants={headVariants}
						initial="normal"
						animate={controls}
					/>
					<motion.g
						variants={cogCircleVariants}
						initial="normal"
						animate={controls}
					>
						<motion.circle cx="18" cy="15" r="3" />
						<motion.path d="m14.305 16.53.923-.382" />
						<motion.path d="m15.228 13.852-.923-.383" />
						<motion.path d="m16.852 12.228-.383-.923" />
						<motion.path d="m16.852 17.772-.383.924" />
						<motion.path d="m19.148 12.228.383-.923" />
						<motion.path d="m19.53 18.696-.382-.924" />
						<motion.path d="m20.772 13.852.924-.383" />
						<motion.path d="m20.772 16.148.924.383" />
					</motion.g>
				</motion.svg>
			</motion.div>
		);
	},
);

UserCogIcon.displayName = "UserCogIcon";
export { UserCogIcon };
