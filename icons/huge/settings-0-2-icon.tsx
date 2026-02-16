"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface Settings02IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Settings02IconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const Settings02Icon = forwardRef<Settings02IconHandle, Settings02IconProps>(
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
    rotate: 0,
   },
   animate: {
    scale: [1, 1.04, 0.98, 1],
    rotate: [0, -2, 2, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
    },
   },
  };

  const outerVariants: Variants = {
   normal: {
    rotate: 0,
   },
   animate: {
    rotate: [0, 18, 32, 28, 30],
    transition: {
     duration: 0.7 * duration,
     ease: "easeOut",
    },
   },
  };

  const innerVariants: Variants = {
   normal: {
    scale: 1,
   },
   animate: {
    scale: [1, 0.85, 1.08, 1],
    transition: {
     duration: 0.55 * duration,
     ease: "easeOut",
     delay: 0.08,
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
     initial="normal"
     animate={controls}
     variants={containerVariants}
     style={{ transformOrigin: "center" }}
    >
     <motion.g variants={outerVariants} style={{ transformOrigin: "center" }}>
      <path d="M20.7906 9.15201C21.5969 10.5418 22 11.2366 22 12C22 12.7634 21.5969 13.4582 20.7906 14.848L18.8669 18.1638C18.0638 19.548 17.6623 20.2402 17.0019 20.6201C16.3416 21 15.5402 21 13.9373 21L10.0627 21C8.45982 21 7.6584 21 6.99807 20.6201C6.33774 20.2402 5.93619 19.548 5.13311 18.1638L3.20942 14.848C2.40314 13.4582 2 12.7634 2 12C2 11.2366 2.40314 10.5418 3.20942 9.152L5.13311 5.83621C5.93619 4.45196 6.33774 3.75984 6.99807 3.37992C7.6584 3 8.45982 3 10.0627 3L13.9373 3C15.5402 3 16.3416 3 17.0019 3.37992C17.6623 3.75984 18.0638 4.45197 18.8669 5.83622L20.7906 9.15201Z" />
     </motion.g>

     <motion.g variants={innerVariants} style={{ transformOrigin: "center" }}>
      <path d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z" />
     </motion.g>
    </motion.svg>
   </motion.div>
  );
 },
);

Settings02Icon.displayName = "Settings02Icon";
export { Settings02Icon };
