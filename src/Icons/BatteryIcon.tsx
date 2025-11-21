"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BatteryIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BatteryIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const BatteryIcon = forwardRef<BatteryIconHandle, BatteryIconProps>(
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
  const svgControls = useAnimation();
  const rectControls = useAnimation();
  const tipControls = useAnimation();

  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () => {
     if (reduced) {
      svgControls.start("normal");
      rectControls.start("normal");
      tipControls.start("normal");
     } else {
      svgControls.start("warning");
      rectControls.start("warning");
      tipControls.start("warning");
     }
    },
    stopAnimation: () => {
     svgControls.start("normal");
     rectControls.start("normal");
     tipControls.start("normal");
    },
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     svgControls.start("warning");
     rectControls.start("warning");
     tipControls.start("warning");
    } else {
     onMouseEnter?.(e as any);
    }
   },
   [svgControls, rectControls, tipControls, reduced, onMouseEnter, isAnimated],
  );

  const handleLeave = useCallback(
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     svgControls.start("normal");
     rectControls.start("normal");
     tipControls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [svgControls, rectControls, tipControls, onMouseLeave],
  );

  const svgVariants: Variants = {
   normal: { rotate: 0, scale: 1 },
   warning: {
    rotate: [0, -4, 4, -2, 0],
    scale: [1, 1.1, 0.95, 1.05, 1],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const rectVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   warning: {
    pathLength: [1, 0.6, 1],
    opacity: [1, 0.7, 1],
    transition: { duration: 1 * duration, ease: "easeInOut" },
   },
  };

  const tipVariants: Variants = {
   normal: { y: 0, opacity: 1 },
   warning: {
    y: [0, -2, 2, -1, 0],
    opacity: [1, 0.6, 1],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
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
     animate={svgControls}
     initial="normal"
     variants={svgVariants}
    >
     <motion.path
      d="M22 14L22 10"
      animate={tipControls}
      initial="normal"
      variants={tipVariants}
     />
     <motion.rect
      x="2"
      y="6"
      width="16"
      height="12"
      rx="2"
      animate={rectControls}
      initial="normal"
      variants={rectVariants}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

BatteryIcon.displayName = "BatteryIcon";
export { BatteryIcon };
