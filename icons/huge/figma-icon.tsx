"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface FigmaIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FigmaIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const FigmaIcon = forwardRef<FigmaIconHandle, FigmaIconProps>(
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

  const containerVariants: Variants = {
   normal: {
    scale: 1,
    y: 0,
   },
   animate: {
    scale: [1, 1.04, 1],
    y: [0, -1, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
    },
   },
  };

  const segmentVariants: Variants = {
   normal: {
    opacity: 1,
    y: 0,
   },
   animate: (i: number) => ({
    opacity: [0, 1],
    y: [3, 0],
    transition: {
     duration: 0.45 * duration,
     ease: "easeOut",
     delay: i * 0.08,
    },
   }),
  };

  return (
   <motion.div
    className={cn("inline-flex items-center justify-center", className)}
    onMouseEnter={handleEnter}
    onMouseLeave={handleLeave}
    {...props}
   >
    <motion.svg
     width={size}
     height={size}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinejoin="round"
     initial="normal"
     animate={controls}
     variants={containerVariants}
    >
     <motion.path
      d="M12 3V9H9C7.34315 9 6 7.65685 6 6C6 4.34315 7.34315 3 9 3H12Z"
      variants={segmentVariants}
      custom={0}
     />

     <motion.path
      d="M12 3V9H15C16.6569 9 18 7.65685 18 6C18 4.34315 16.6569 3 15 3H12Z"
      variants={segmentVariants}
      custom={1}
     />

     <motion.path
      d="M12 9V15H9C7.34315 15 6 13.6569 6 12C6 10.3431 7.34315 9 9 9H12Z"
      variants={segmentVariants}
      custom={2}
     />

     <motion.path
      d="M9 21C10.6569 21 12 19.6569 12 18V15H9C7.34315 15 6 16.3431 6 18C6 19.6569 7.34315 21 9 21Z"
      variants={segmentVariants}
      custom={3}
     />

     <motion.circle
      cx="15"
      cy="12"
      r="3"
      variants={segmentVariants}
      custom={4}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

FigmaIcon.displayName = "FigmaIcon";
export { FigmaIcon };
