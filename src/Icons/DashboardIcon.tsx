"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface DashboardIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface DashboardIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const DashboardIcon = forwardRef<DashboardIconHandle, DashboardIconProps>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 0.6,
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

  const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const iconVariants: Variants = {
   normal: { scale: 1, rotate: 0 },
   animate: {
    scale: [1, 1.06, 0.98, 1],
    rotate: [0, -1.5, 1.5, 0],
    transition: { duration: 1.1 * duration, ease: "easeInOut" },
   },
  };

  const tileVariants: Variants = {
   normal: { opacity: 1, scale: 1, y: 0 },
   animate: (i: number) => ({
    opacity: [0.6, 1],
    scale: [0.95, 1.04, 1],
    y: [3, -2, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: i * 0.08,
    },
   }),
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
     <motion.rect
      width="7"
      height="9"
      x="3"
      y="3"
      rx="1"
      variants={tileVariants}
      custom={0}
      initial="normal"
      animate={controls}
     />
     <motion.rect
      width="7"
      height="5"
      x="14"
      y="3"
      rx="1"
      variants={tileVariants}
      custom={1}
      initial="normal"
      animate={controls}
     />
     <motion.rect
      width="7"
      height="9"
      x="14"
      y="12"
      rx="1"
      variants={tileVariants}
      custom={2}
      initial="normal"
      animate={controls}
     />
     <motion.rect
      width="7"
      height="5"
      x="3"
      y="16"
      rx="1"
      variants={tileVariants}
      custom={3}
      initial="normal"
      animate={controls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

DashboardIcon.displayName = "DashboardIcon";
export { DashboardIcon };
