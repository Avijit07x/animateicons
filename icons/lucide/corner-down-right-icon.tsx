"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface CornerDownRightIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CornerDownRightIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const CornerDownRightIcon = forwardRef<
 CornerDownRightIconHandle,
 CornerDownRightIconProps
>(
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
    scale: [1, 1.12, 0.95, 1],
    rotate: [0, 8, -4, 0],
    transition: { duration: 0.9 * duration, ease: "easeInOut" },
   },
  };

  const arrowVariants: Variants = {
   normal: { opacity: 1, x: 0, y: 0, rotate: 0 },
   animate: {
    opacity: [0, 1],
    x: [-8, 2, 0],
    y: [-4, 2, 0],
    rotate: [25, -10, 0],
    transition: { duration: 0.8 * duration, ease: "easeOut", delay: 0.1 },
   },
  };

  const pathVariants: Variants = {
   normal: { pathLength: 1 },
   animate: {
    pathLength: [0, 1],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
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
      d="M4 4v7a4 4 0 0 0 4 4h12"
      variants={pathVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="m15 10 5 5-5 5"
      variants={arrowVariants}
      initial="normal"
      animate={controls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

CornerDownRightIcon.displayName = "CornerDownRightIcon";
export { CornerDownRightIcon };
