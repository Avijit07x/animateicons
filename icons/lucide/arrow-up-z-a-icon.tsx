"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface ArrowUpZaIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ArrowUpZaIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const ArrowUpZaIcon = forwardRef<ArrowUpZaIconHandle, ArrowUpZaIconProps>(
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
    scale: [1, 1.1, 0.95, 1],
    rotate: [0, -5, 3, 0],
    transition: { duration: 0.9 * duration, ease: "easeInOut" },
   },
  };

  const arrowVariants: Variants = {
   normal: { y: 0, opacity: 1 },
   animate: {
    y: [6, -2, 0],
    opacity: [0, 1],
    transition: { duration: 0.6 * duration, ease: "easeOut" },
   },
  };

  const lineVariants: Variants = {
   normal: { pathLength: 1 },
   animate: {
    pathLength: [0, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     delay: 0.1,
    },
   },
  };

  const zVariants: Variants = {
   normal: { opacity: 1, x: 0 },
   animate: {
    opacity: [0, 1],
    x: [6, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeOut",
     delay: 0.2,
    },
   },
  };

  const aVariants: Variants = {
   normal: { opacity: 1, y: 0 },
   animate: {
    opacity: [0, 1],
    y: [6, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeOut",
     delay: 0.3,
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
      d="m3 8 4-4 4 4"
      variants={arrowVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M7 4v16"
      variants={lineVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M15 4h5l-5 6h5"
      variants={zVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M15 20v-3.5a2.5 2.5 0 0 1 5 0V20"
      variants={aVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M20 18h-5"
      variants={aVariants}
      initial="normal"
      animate={controls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

ArrowUpZaIcon.displayName = "ArrowUpZaIcon";
export { ArrowUpZaIcon };
