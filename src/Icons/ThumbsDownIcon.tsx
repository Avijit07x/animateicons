"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ThumbsDownIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ThumbsDownIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const ThumbsDownIcon = forwardRef<ThumbsDownIconHandle, ThumbsDownIconProps>(
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
  const sparks = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () =>
     reduced ? controls.start("idle") : controls.start("dislike"),
    stopAnimation: () => controls.start("idle"),
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     controls.start("dislike");
     sparks.start("burst");
    } else onMouseEnter?.(e as any);
   },
   [controls, sparks, reduced, isAnimated, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("idle");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const svgVariants: Variants = {
   idle: { scale: 1 },
   dislike: {
    scale: [1, 1.06, 0.98, 1],
    transition: { duration: 0.6 * duration, ease: "easeOut" },
   },
  };

  const stemVariants: Variants = {
   idle: { pathLength: 1, opacity: 1 },
   dislike: {
    pathLength: [1, 0.6, 1],
    opacity: [1, 0.7, 1],
    transition: { duration: 0.5 * duration, ease: "easeOut" },
   },
  };

  const thumbVariants: Variants = {
   idle: { rotate: 0, y: 0, pathLength: 1, opacity: 1 },
   dislike: {
    rotate: [0, 18, -8, 0],
    y: [0, 8, 4, 0],
    pathLength: [0.8, 1, 0.6, 1],
    opacity: [0.9, 1, 0.8, 1],
    transition: { duration: 0.7 * duration, ease: "circOut" },
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
     initial="idle"
     animate={controls}
    >
     <motion.path d="M17 14V2" variants={stemVariants} initial="idle" />

     <motion.path
      d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"
      variants={thumbVariants}
      initial="idle"
     />
    </motion.svg>
   </motion.div>
  );
 },
);

ThumbsDownIcon.displayName = "ThumbsDownIcon";
export { ThumbsDownIcon };
