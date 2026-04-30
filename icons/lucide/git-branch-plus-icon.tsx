"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface GitBranchPlusIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GitBranchPlusIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
 color?: string;
}

const GitBranchPlusIcon = forwardRef<
 GitBranchPlusIconHandle,
 GitBranchPlusIconProps
>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 0.8,
   isAnimated = true,
   color,
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

  const easeSmooth: [number, number, number, number] = [0.25, 1, 0.5, 1];

  const trunkNodeVariants: Variants = {
   normal: {
    scale: 1,
    opacity: 1,
   },
   animate: {
    scale: [1, 1.12, 1],
    opacity: [1, 0.9, 1],
    transition: {
     duration: duration * 0.35,
     ease: easeSmooth,
    },
   },
  };

  const pathVariants: Variants = {
   normal: {
    pathLength: 1,
    opacity: 1,
   },
   animate: {
    pathLength: [0, 1],
    opacity: [0.3, 1],
    transition: {
     pathLength: {
      duration: duration * 0.6,
      ease: easeSmooth,
      delay: duration * 0.15,
     },
     opacity: {
      duration: duration * 0.3,
      ease: "easeOut",
      delay: duration * 0.15,
     },
    },
   },
  };

  const branchNodeVariants: Variants = {
   normal: {
    scale: 1,
    opacity: 1,
   },
   animate: {
    scale: [0.7, 1.1, 1],
    opacity: [0, 1],
    transition: {
     duration: duration * 0.35,
     ease: easeSmooth,
     delay: duration * 0.55,
    },
   },
  };

  const plusVariants: Variants = {
   normal: { scale: 1, rotate: 0 },
   animate: {
    scale: [1, 1.2, 0.85, 1],
    rotate: [0, 10, -10, 0],
    transition: { duration: 1 * duration, ease: "easeInOut", repeat: 0 },
   },
  };

  const lineVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: 1,
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     repeat: 0,
     repeatDelay: 0.4,
    },
   },
  };

  return (
   <motion.div
    className={cn("inline-flex items-center justify-center", className)}
    onMouseEnter={handleEnter}
    onMouseLeave={handleLeave}
    {...props}
    style={{ color, ...props.style }}
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
     style={{ overflow: "visible" }}
    >
     <motion.circle
      cx="6"
      cy="18"
      r="3"
      style={{ transformOrigin: "center" }}
      variants={trunkNodeVariants}
      initial="normal"
      animate={controls}
     />

     <motion.path
      d="M15 6a9 9 0 0 0-9 9V3"
      variants={pathVariants}
      initial="normal"
      animate={controls}
     />

     <motion.circle
      cx="18"
      cy="6"
      r="3"
      style={{ transformOrigin: "center" }}
      variants={branchNodeVariants}
      initial="normal"
      animate={controls}
     />

     <motion.g variants={plusVariants} initial="normal" animate={controls}>
      <motion.path d="M18 15v6" variants={lineVariants} />
      <motion.path d="M21 18h-6" variants={lineVariants} />
     </motion.g>
    </svg>
   </motion.div>
  );
 },
);

GitBranchPlusIcon.displayName = "GitBranchPlusIcon";

export { GitBranchPlusIcon };
