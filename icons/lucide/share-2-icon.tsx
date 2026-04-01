"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface Share2IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Share2IconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
}

const Share2Icon = forwardRef<Share2IconHandle, Share2IconProps>(
 (
  { onMouseEnter, onMouseLeave, className, size = 24, duration = 1, ...props },
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
    if (reduced) return;
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

  const iconVariants: Variants = {
   normal: { scale: 1, rotate: 0 },
   animate: {
    scale: [1, 1.1, 0.95, 1],
    rotate: [0, -5, 5, 0],
    transition: { duration: 1.2 * duration, ease: "easeInOut", repeat: 0 },
   },
  };

  const circleVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: { duration: 1.2 * duration, ease: "easeInOut", repeat: 0 },
   },
  };

  const lineVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0.5, 1],
    transition: {
     duration: 1.4 * duration,
     ease: "easeInOut",
     repeat: 0,
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
     <motion.circle cx="18" cy="5" r="3" variants={circleVariants} />
     <motion.circle cx="6" cy="12" r="3" variants={circleVariants} />
     <motion.circle cx="18" cy="19" r="3" variants={circleVariants} />
     <motion.line
      x1="8.59"
      x2="15.42"
      y1="13.51"
      y2="17.49"
      variants={lineVariants}
     />
     <motion.line
      x1="15.41"
      x2="8.59"
      y1="6.51"
      y2="10.49"
      variants={lineVariants}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

Share2Icon.displayName = "Share2Icon";
export { Share2Icon };
