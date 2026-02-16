"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ZapHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ZapProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const ZapIcon = forwardRef<ZapHandle, ZapProps>(
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

  const bodyVariants: Variants = {
   normal: {
    pathLength: 1,
    pathOffset: 0,
    opacity: 1,
    scale: 1,
    rotate: 0,
   },
   animate: {
    pathLength: [0, 1],
    pathOffset: [0.6, 0],
    opacity: [0.4, 1],
    scale: [0.92, 1.08, 1],
    rotate: [0, -4, 2, 0],
    transition: {
     pathLength: {
      duration: 0.45 * duration,
      ease: "easeOut",
     },
     pathOffset: {
      duration: 0.45 * duration,
      ease: "easeOut",
     },
     scale: {
      duration: 0.6 * duration,
      ease: "easeOut",
     },
     rotate: {
      duration: 0.6 * duration,
      ease: "easeOut",
     },
     opacity: {
      duration: 0.25 * duration,
      ease: "linear",
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
     className="lucide lucide-zap-icon lucide-zap"
    >
     <motion.path
      d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
      variants={bodyVariants}
      initial="normal"
      animate={controls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

ZapIcon.displayName = "ZapIcon";
export { ZapIcon };
