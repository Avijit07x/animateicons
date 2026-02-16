"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface MoveLeftIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MoveLeftIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const MoveLeftIcon = forwardRef<MoveLeftIconHandle, MoveLeftIconProps>(
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
    transition: { duration: 0.6 * duration, repeat: 0, ease: "easeInOut" },
   },
  };

  const lineVariants: Variants = {
   normal: { strokeOpacity: 1 },
   animate: {
    strokeOpacity: [1, 0.5, 1],
    transition: { duration: 0.8 * duration, repeat: 0 },
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
      d="M6 8L2 12L6 16"
      variants={arrowVariants}
      stroke="currentColor"
     />
     <motion.path d="M2 12H22" variants={lineVariants} stroke="currentColor" />
    </motion.svg>
   </motion.div>
  );
 },
);

MoveLeftIcon.displayName = "MoveLeftIcon";
export { MoveLeftIcon };
