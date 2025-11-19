"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BringToFrontIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BringToFrontIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const BringToFrontIcon = forwardRef<
 BringToFrontIconHandle,
 BringToFrontIconProps
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
   [controls, onMouseEnter, reduced],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const svgVariants: Variants = {
   normal: { scale: 1, rotate: 0 },
   animate: {
    rotate: [0, -3, 3, 0],
    scale: [1, 1.05, 0.95, 1],
    transition: {
     duration: 1 * duration,
     ease: [0.42, 0, 0.58, 1],
     repeat: 0,
    },
   },
  };

  const pathVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0.5, 1],
    transition: {
     duration: 0.8 * duration,
     ease: [0.42, 0, 0.58, 1],
     repeat: 0,
    },
   },
  };

  const rectVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.2, 0.9, 1],
    transition: {
     duration: 0.8 * duration,
     ease: [0.42, 0, 0.58, 1],
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
     variants={svgVariants}
    >
     <motion.rect
      x="8"
      y="8"
      width="8"
      height="8"
      rx="2"
      variants={rectVariants}
     />
     <motion.path
      d="M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2"
      variants={pathVariants}
     />
     <motion.path
      d="M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2"
      variants={pathVariants}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

BringToFrontIcon.displayName = "BringToFrontIcon";
export { BringToFrontIcon };
