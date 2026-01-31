"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface BellMinusIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BellMinusIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const BellMinusIcon = forwardRef<BellMinusIconHandle, BellMinusIconProps>(
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

  const bellVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -12, 10, -6, 3, 0],
    transition: { duration: 1.4 * duration, ease: "easeInOut", repeat: 0 },
   },
  };

  const clapperVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, -3, 3, -2, 1, 0],
    transition: { duration: 1.4 * duration, ease: "easeInOut", repeat: 0 },
   },
  };

  const minusVariants: Variants = {
   normal: { scaleX: 1, opacity: 1, rotate: 0 },
   animate: {
    scaleX: [1, 0.6, 1.2, 1],
    rotate: [0, -10, 10, 0],
    opacity: [1, 0.6, 1],
    transition: { duration: 1.2 * duration, ease: "easeInOut", repeat: 0 },
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
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     variants={bellVariants}
     animate={controls}
     initial="normal"
    >
     <motion.path d="M10.268 21a2 2 0 0 0 3.464 0" variants={clapperVariants} />
     <motion.path d="M15 8h6" variants={minusVariants} />
     <path d="M16.243 3.757A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673A9.4 9.4 0 0 1 18.667 12" />
    </motion.svg>
   </motion.div>
  );
 },
);

BellMinusIcon.displayName = "BellMinusIcon";
export { BellMinusIcon };
