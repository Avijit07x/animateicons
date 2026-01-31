"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface ChromeIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ChromeIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const ChromeIcon = forwardRef<ChromeIconHandle, ChromeIconProps>(
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

  const ringVariants: Variants = {
   normal: {
    rotate: 0,
   },
   animate: {
    rotate: [0, 300, 360],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
    },
   },
  };

  const centerVariants: Variants = {
   normal: {
    scale: 1,
    opacity: 1,
   },
   animate: {
    scale: [1, 1.25, 1],
    opacity: [1, 0.7, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeOut",
    },
   },
  };

  const sweepVariants: Variants = {
   normal: {
    opacity: 0.8,
   },
   animate: {
    opacity: [0.8, 0.25, 0.8],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
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
     initial="normal"
     animate={controls}
    >
     <motion.circle cx="12" cy="12" r="10" variants={ringVariants} />

     <motion.circle cx="12" cy="12" r="4" variants={centerVariants} />

     <motion.line x1="21.17" y1="8" x2="12" y2="8" variants={sweepVariants} />
     <motion.line
      x1="3.95"
      y1="6.06"
      x2="8.54"
      y2="14"
      variants={sweepVariants}
      transition={{ delay: 0.08 * duration }}
     />
     <motion.line
      x1="10.88"
      y1="21.94"
      x2="15.46"
      y2="14"
      variants={sweepVariants}
      transition={{ delay: 0.16 * duration }}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

ChromeIcon.displayName = "ChromeIcon";
export { ChromeIcon };
