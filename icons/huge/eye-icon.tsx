"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface EyeIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface EyeIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const EyeIcon = forwardRef<EyeIconHandle, EyeIconProps>(
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
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
    >
     <motion.path
      d="M21.544 11.045C21.848 11.4713 22 11.6845 22 12C22 12.3155 21.848 12.5287 21.544 12.955C20.1779 14.8706 16.6892 19 12 19C7.31078 19 3.8221 14.8706 2.45604 12.955C2.15201 12.5287 2 12.3155 2 12C2 11.6845 2.15201 11.4713 2.45604 11.045C3.8221 9.12944 7.31078 5 12 5C16.6892 5 20.1779 9.12944 21.544 11.045Z"
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
