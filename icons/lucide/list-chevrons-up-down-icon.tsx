"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface ListChevronsUpDownIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ListChevronsUpDownIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const ListChevronsUpDownIcon = forwardRef<
 ListChevronsUpDownIconHandle,
 ListChevronsUpDownIconProps
>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 0.9,
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
     onMouseLeave?.(e);
    }
   },
   [controls, onMouseLeave],
  );

  const lineVariant: Variants = {
   normal: { x: 0, opacity: 1 },
   animate: {
    x: [0, -2, 2, 0],
    opacity: [1, 0.9, 0.9, 1],
    transition: {
     duration: 0.75 * duration,
     ease: "easeInOut",
     repeat: 0,
    },
   },
  };

  const topChevron: Variants = {
   normal: { y: 0, opacity: 1, rotate: 0 },
   animate: {
    y: [0, -4, -2, 0],
    rotate: [0, -4, -2, 0],
    opacity: [1, 0.9, 0.95, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeOut",
     repeat: 0,
     delay: 0.04,
    },
   },
  };

  const bottomChevron: Variants = {
   normal: { y: 0, opacity: 1, rotate: 0 },
   animate: {
    y: [0, 4, 2, 0],
    rotate: [0, 4, 2, 0],
    opacity: [1, 0.9, 0.95, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeOut",
     repeat: 0,
     delay: 0.12,
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
     strokeWidth={2}
     strokeLinecap="round"
     strokeLinejoin="round"
     animate={controls}
     initial="normal"
    >
     <motion.path d="M3 5h8" variants={lineVariant} stroke="currentColor" />
     <motion.path
      d="M3 12h8"
      variants={lineVariant}
      stroke="currentColor"
      transition={{ delay: 0.06 }}
     />
     <motion.path
      d="M3 19h8"
      variants={lineVariant}
      stroke="currentColor"
      transition={{ delay: 0.12 }}
     />
     <motion.path
      d="m15 8 3-3 3 3"
      variants={topChevron}
      stroke="currentColor"
     />
     <motion.path
      d="m15 16 3 3 3-3"
      variants={bottomChevron}
      stroke="currentColor"
     />
    </motion.svg>
   </motion.div>
  );
 },
);

ListChevronsUpDownIcon.displayName = "ListChevronsUpDownIcon";
export { ListChevronsUpDownIcon };
