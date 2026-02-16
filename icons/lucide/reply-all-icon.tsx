"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ReplyAllHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ReplyAllProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const ReplyAllIcon = forwardRef<ReplyAllHandle, ReplyAllProps>(
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

  const arrowVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, -3, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
    },
   },
  };

  const arrowSecondaryVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, -1.5, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     delay: 0.05 * duration,
    },
   },
  };

  const curveVariants: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.6, 1],
    transition: {
     duration: 0.6 * duration,
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
      d="m12 17-5-5 5-5"
      variants={arrowVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="m7 17-5-5 5-5"
      variants={arrowSecondaryVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M22 18v-2a4 4 0 0 0-4-4H7"
      variants={curveVariants}
      initial="normal"
      animate={controls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

ReplyAllIcon.displayName = "ReplyAllIcon";
export { ReplyAllIcon };
