"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ThumbsUpIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ThumbsUpIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const ThumbsUpIcon = forwardRef<ThumbsUpIconHandle, ThumbsUpIconProps>(
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
     reduced ? controls.start("idle") : controls.start("like"),
    stopAnimation: () => controls.start("idle"),
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     controls.start("like");
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
   like: {
    scale: [1, 1.14, 0.98, 1],
    transition: { duration: 0.6 * duration, ease: "easeOut" },
   },
  };

  const thumbVariants: Variants = {
   idle: { rotate: 0, y: 0, pathLength: 1, opacity: 1 },
   like: {
    rotate: [0, -18, 10, -4, 0],
    y: [0, -8, -4, -2, 0],
    pathLength: [0.8, 1, 0.6, 1],
    opacity: [0.9, 1, 0.8, 1],
    transition: { duration: 0.7 * duration, ease: "circOut" },
   },
  };

  const stemVariants: Variants = {
   idle: { pathLength: 1, opacity: 1 },
   like: {
    pathLength: [0.6, 1],
    opacity: [0.6, 1],
    transition: { duration: 0.5 * duration, ease: "easeOut" },
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
     <motion.path d="M7 10v12" variants={stemVariants} initial="idle" />
     <motion.path
      d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
      variants={thumbVariants}
      initial="idle"
     />
    </motion.svg>
   </motion.div>
  );
 },
);

ThumbsUpIcon.displayName = "ThumbsUpIcon";
export { ThumbsUpIcon };
