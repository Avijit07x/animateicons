"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BarsIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BarsIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const BarsIcon = forwardRef<BarsIconHandle, BarsIconProps>(
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
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     controls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [controls, onMouseLeave],
  );

  const firstBarVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, 90],
    transition: {
     duration: 0.25 * duration,
     ease: "easeOut",
     repeat: 0,
     delay: 0,
    },
   },
  };

  const secondBarVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, 110],
    transition: {
     duration: 0.25 * duration,
     ease: "easeOut",
     repeat: 0,
     delay: 0.05 * duration,
    },
   },
  };

  const thirdBarVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, 130],
    transition: {
     duration: 0.25 * duration,
     ease: "easeOut",
     repeat: 0,
     delay: 0.1 * duration,
    },
   },
  };

  return (
   <motion.div
    className={cn("relative inline-flex", className)}
    onMouseEnter={handleEnter}
    onMouseLeave={handleLeave}
    {...props}
   >
    <motion.svg
     xmlns="http://www.w3.org/2000/svg"
     width={size}
     height={size}
     viewBox="0 0 448 512"
     fill="currentColor"
     animate={controls}
     initial="normal"
    >
     <motion.path
      fill="currentColor"
      d="M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96z"
      variants={firstBarVariants}
     />
     <motion.path
      fill="currentColor"
      d="M0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32z"
      variants={secondBarVariants}
     />
     <motion.path
      fill="currentColor"
      d="M448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z"
      variants={thirdBarVariants}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

BarsIcon.displayName = "BarsIcon";
export { BarsIcon };
