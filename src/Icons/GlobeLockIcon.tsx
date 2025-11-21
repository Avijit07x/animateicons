"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface GlobeLockIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GlobeLockIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const GlobeLockIcon = forwardRef<GlobeLockIconHandle, GlobeLockIconProps>(
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

  const lockVariants: Variants = {
   normal: { rotate: 0, x: 0, opacity: 1 },
   animate: {
    rotate: [0, -8, 8, -5, 5, 0],
    x: [0, -2, 2, -1, 1, 0],
    transition: {
     duration: 0.8 * duration,
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
    <svg
     xmlns="http://www.w3.org/2000/svg"
     width={size}
     height={size}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
    >
     <path d="M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13" />
     <path d="M2 12h8.5" />

     <motion.path
      d="M20 6V4a2 2 0 1 0-4 0v2"
      variants={lockVariants}
      initial="normal"
      animate={controls}
     />
     <motion.rect
      width="8"
      height="5"
      x="14"
      y="6"
      rx="1"
      variants={lockVariants}
      initial="normal"
      animate={controls}
     />
    </svg>
   </motion.div>
  );
 },
);

GlobeLockIcon.displayName = "GlobeLockIcon";
export { GlobeLockIcon };
