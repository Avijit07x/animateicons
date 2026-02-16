"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, MotionProps } from "motion/react";
import { useEffect, useState } from "react";

interface WordRotateProps {
	words: string[];
	duration?: number;
	motionProps?: MotionProps;
	className?: string;
	onWordChange?: (word: string) => void;
}

export function WordRotate({
	words,
	duration = 2500,
	motionProps = {
		initial: { opacity: 0, y: -50 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: 50 },
		transition: { duration: 0.3, ease: "easeOut" },
	},
	className,
	onWordChange,
}: WordRotateProps) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex((prevIndex) => (prevIndex + 1) % words.length);
		}, duration);

		return () => clearInterval(interval);
	}, [words.length, duration]);

	useEffect(() => {
		onWordChange?.(words[index]);
	}, [index, words, onWordChange]);

	return (
		<div className="min-w-30 overflow-y-hidden">
			<AnimatePresence mode="wait">
				<motion.span
					key={words[index]}
					className={cn("inline-flex items-center justify-center", className)}
					{...motionProps}
				>
					{words[index]}
				</motion.span>
			</AnimatePresence>
		</div>
	);
}
