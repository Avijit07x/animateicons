"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface MarsIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MarsIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const MarsIcon = forwardRef<MarsIconHandle, MarsIconProps>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 0.8,
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

  const softSpring: [number, number, number, number] = [0.32, 1.2, 0.5, 1];
  const smoothDraw: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const arrowVariants: Variants = {
   normal: {
    scale: 1,
    opacity: 1,
    rotate: 0,
   },
   animate: {
    scale: [0, 1.12, 1],
    opacity: [0, 1],
    rotate: [-12, 2, 0],
    transition: {
     scale: { duration: duration * 0.55, ease: softSpring },
     opacity: { duration: duration * 0.3, ease: smoothDraw },
     rotate: { duration: duration * 0.55, ease: softSpring },
    },
   },
  };

  const lineVariants: Variants = {
   normal: {
    pathLength: 1,
    opacity: 1,
   },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     pathLength: {
      duration: duration * 0.5,
      ease: smoothDraw,
      delay: duration * 0.18,
     },
     opacity: {
      duration: duration * 0.25,
      ease: smoothDraw,
      delay: duration * 0.18,
     },
    },
   },
  };

  const circleVariants: Variants = {
   normal: {
    pathLength: 1,
    opacity: 1,
    scale: 1,
   },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    scale: [0.88, 1.04, 1],
    transition: {
     pathLength: {
      duration: duration * 0.65,
      ease: smoothDraw,
      delay: duration * 0.35,
     },
     opacity: {
      duration: duration * 0.3,
      ease: smoothDraw,
      delay: duration * 0.35,
     },
     scale: {
      duration: duration * 0.65,
      ease: softSpring,
      delay: duration * 0.35,
     },
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
    >
     <motion.path
      d="M16 3h5v5"
      variants={arrowVariants}
      initial="normal"
      animate={controls}
     />

     <motion.path
      d="m21 3-6.75 6.75"
      variants={lineVariants}
      initial="normal"
      animate={controls}
     />

     <motion.circle
      cx="10"
      cy="14"
      r="6"
      variants={circleVariants}
      initial="normal"
      animate={controls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

MarsIcon.displayName = "MarsIcon";
export { MarsIcon };
