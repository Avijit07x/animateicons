"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface ScanLineIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ScanLineIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const ScanLineIcon = forwardRef<ScanLineIconHandle, ScanLineIconProps>(
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

  const handleLeave = useCallback(() => {
   if (!isControlled.current) controls.start("normal");
  }, [controls]);

  const frame: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.65, 1],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     repeat: Infinity,
    },
   },
  };

  const scanLine: Variants = {
   normal: { y: 0, opacity: 1 },
   animate: {
    y: [-6, 6, -6],
    opacity: [0.4, 1, 0.4],
    transition: {
     duration: 1 * duration,
     ease: "easeInOut",
     repeat: Infinity,
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
     <motion.path d="M3 7V5a2 2 0 0 1 2-2h2" variants={frame} />
     <motion.path d="M17 3h2a2 2 0 0 1 2 2v2" variants={frame} />
     <motion.path d="M21 17v2a2 2 0 0 1-2 2h-2" variants={frame} />
     <motion.path d="M7 21H5a2 2 0 0 1-2-2v-2" variants={frame} />

     <motion.path d="M7 12h10" variants={scanLine} />
    </motion.svg>
   </motion.div>
  );
 },
);

ScanLineIcon.displayName = "ScanLineIcon";
export { ScanLineIcon };
