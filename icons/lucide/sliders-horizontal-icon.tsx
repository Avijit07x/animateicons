"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface SlidersHorizontalHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SlidersHorizontalProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const SlidersHorizontalIcon = forwardRef<
 SlidersHorizontalHandle,
 SlidersHorizontalProps
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
   [controls, reduced, isAnimated, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const trackVariants: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.6, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
    },
   },
  };

  const knobVariants: Variants = {
   normal: { x: 0 },
   animate: (i: number) => ({
    x: [0, i * 3, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     delay: i * 0.05,
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
    >
     <motion.path
      d="M10 5H3"
      variants={trackVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M21 5h-7"
      variants={trackVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M12 19H3"
      variants={trackVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M21 19h-5"
      variants={trackVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M21 12h-9"
      variants={trackVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M8 12H3"
      variants={trackVariants}
      initial="normal"
      animate={controls}
     />

     <motion.path
      d="M14 3v4"
      variants={knobVariants}
      custom={1}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M16 17v4"
      variants={knobVariants}
      custom={-1}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M8 10v4"
      variants={knobVariants}
      custom={1}
      initial="normal"
      animate={controls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

SlidersHorizontalIcon.displayName = "SlidersHorizontalIcon";
export { SlidersHorizontalIcon };
