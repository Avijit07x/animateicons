"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ExternalLinkIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface EyeIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const EyeIcon = forwardRef<ExternalLinkIconHandle, EyeIconProps>(
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
  const eyeControls = useAnimation();
  const pupilControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () => {
     if (reduced) {
      eyeControls.start("open");
      pupilControls.start("center");
     } else {
      eyeControls.start("blink");
      pupilControls.start("scan");
     }
    },
    stopAnimation: () => {
     eyeControls.start("open");
     pupilControls.start("center");
    },
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     eyeControls.start("blink");
     pupilControls.start("scan");
    } else {
     onMouseEnter?.(e as any);
    }
   },
   [eyeControls, pupilControls, onMouseEnter, reduced, isAnimated],
  );

  const handleLeave = useCallback(
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     eyeControls.start("open");
     pupilControls.start("center");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [eyeControls, pupilControls, onMouseLeave],
  );

  const eyeVariants: Variants = {
   open: { scaleY: 1 },
   blink: {
    scaleY: [1, 0.1, 1],
    transition: {
     duration: 0.25 * duration,
     repeatDelay: 2.4,
     ease: "easeInOut",
    },
   },
  };

  const pupilVariants: Variants = {
   center: { x: 0 },
   scan: {
    x: [-2, 2, -1, 1, 0],
    transition: {
     duration: 1.6 * duration,
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
     strokeWidth={2}
     strokeLinecap="round"
     strokeLinejoin="round"
    >
     <motion.path
      d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
      animate={eyeControls}
      initial="open"
      variants={eyeVariants}
      style={{
       transformBox: "fill-box",
       transformOrigin: "center",
      }}
     />
     <motion.circle
      cx="12"
      cy="12"
      r="3"
      animate={pupilControls}
      initial="center"
      variants={pupilVariants}
     />
    </svg>
   </motion.div>
  );
 },
);

EyeIcon.displayName = "EyeIcon";
export { EyeIcon };
