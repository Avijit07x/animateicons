"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

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
   [controls, reduced, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const outerCircle: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: 360,
    transition: { duration: 4 * duration, repeat: 0, ease: "linear" },
   },
  };

  const innerCircle: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: { duration: 1.5 * duration, repeat: 0 },
   },
  };

  const lines: Variants = {
   normal: { opacity: 0.8 },
   animate: {
    opacity: [0.8, 0.3, 0.8],
    transition: {
     duration: 1.2 * duration,
     repeat: 0,
     staggerChildren: 0.3,
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
    >
     <motion.circle
      cx="12"
      cy="12"
      r="10"
      variants={outerCircle}
      stroke="currentColor"
     />
     <motion.circle
      cx="12"
      cy="12"
      r="4"
      variants={innerCircle}
      stroke="currentColor"
     />
     <motion.line
      x1="21.17"
      y1="8"
      x2="12"
      y2="8"
      variants={lines}
      stroke="currentColor"
     />
     <motion.line
      x1="3.95"
      y1="6.06"
      x2="8.54"
      y2="14"
      variants={lines}
      stroke="currentColor"
     />
     <motion.line
      x1="10.88"
      y1="21.94"
      x2="15.46"
      y2="14"
      variants={lines}
      stroke="currentColor"
     />
    </motion.svg>
   </motion.div>
  );
 },
);

ChromeIcon.displayName = "ChromeIcon";
export { ChromeIcon };
