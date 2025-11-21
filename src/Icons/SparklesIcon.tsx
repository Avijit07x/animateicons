"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface SparklesIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SparklesIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const SparklesIcon = forwardRef<SparklesIconHandle, SparklesIconProps>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 1,
   isAnimated = true,
   ...props
  },
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
    if (!isAnimated || reduced) return;
    if (!isControlled.current) controls.start("animate");
    else onMouseEnter?.(e as any);
   },
   [controls, reduced, isAnimated, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const iconVariants: Variants = {
   normal: { scale: 1, rotate: 0 },
   animate: {
    scale: [1, 1.06, 0.98, 1],
    rotate: [0, -3, 3, 0],
    transition: { duration: 1.1 * duration, ease: "easeInOut" },
   },
  };

  const starVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0.9, 1, 1],
    opacity: [0.8, 1, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.05,
    },
   },
  };

  const crossVariants: Variants = {
   normal: { opacity: 1, scale: 1 },
   animate: {
    opacity: [0.6, 1, 0.8, 1],
    scale: [0.9, 1.05, 1],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     delay: 0.18,
    },
   },
  };

  const dotVariants: Variants = {
   normal: { opacity: 1, scale: 1, y: 0 },
   animate: {
    opacity: [0.7, 1, 1],
    scale: [0.85, 1.1, 1],
    y: [1.5, -0.5, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.28,
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
     animate={controls}
     initial="normal"
     variants={iconVariants}
    >
     <motion.path
      d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
      variants={starVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M20 2v4"
      variants={crossVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M22 4h-4"
      variants={crossVariants}
      initial="normal"
      animate={controls}
     />
     <motion.circle
      cx="4"
      cy="20"
      r="2"
      variants={dotVariants}
      initial="normal"
      animate={controls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

SparklesIcon.displayName = "SparklesIcon";
export { SparklesIcon };
