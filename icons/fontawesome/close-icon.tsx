"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface CloseIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CloseIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
 type?: "solid";
}

const CloseIcon = forwardRef<CloseIconHandle, CloseIconProps>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 1,
   isAnimated = true,
   type = "solid",
   ...props
  },
  ref,
 ) => {
  const shakeControls = useAnimation();
  const drawControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () => {
     if (reduced) {
      shakeControls.start("normal");
      drawControls.start("normal");
     } else {
      shakeControls.start("animate");
      drawControls.start("animate");
     }
    },
    stopAnimation: () => {
     shakeControls.start("normal");
     drawControls.start("normal");
    },
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     shakeControls.start("animate");
     drawControls.start("animate");
    } else {
     onMouseEnter?.(e as any);
    }
   },
   [shakeControls, drawControls, reduced, isAnimated, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     shakeControls.start("normal");
     drawControls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [shakeControls, drawControls, onMouseLeave],
  );

  const drawVariants: Variants = {
   normal: {
    pathLength: 1,
    opacity: 1,
    fillOpacity: 1,
   },
   animate: {
    scale: [0.5, 1.1, 1],
    rotate: [0, -12, 12, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeOut",
    },
   },
  };

  return (
   <motion.div
    className={cn("relative inline-flex", className)}
    onMouseEnter={handleEnter}
    onMouseLeave={handleLeave}
    {...props}
   >
    <motion.svg
     xmlns="http://www.w3.org/2000/svg"
     width={size}
     height={size}
     viewBox="0 0 640 640"
     animate={shakeControls}
     initial="normal"
    >
     <motion.path
      fill="currentColor"
      d="M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z"
      animate={drawControls}
      initial="normal"
      variants={drawVariants}
      style={{ originX: "50%", originY: "50%" }}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

CloseIcon.displayName = "CloseIcon";
export { CloseIcon };
