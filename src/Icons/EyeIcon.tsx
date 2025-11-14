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
  const outerControls = useAnimation();
  const pupilControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () => {
     if (reduced) {
      outerControls.start("visible");
      pupilControls.start("visible");
     } else {
      outerControls.start("animate");
      pupilControls.start("animate");
     }
    },
    stopAnimation: () => {
     outerControls.start("visible");
     pupilControls.start("visible");
    },
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     outerControls.start("animate");
     pupilControls.start("animate");
    } else {
     onMouseEnter?.(e as any);
    }
   },
   [outerControls, pupilControls, onMouseEnter, reduced],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     outerControls.start("visible");
     pupilControls.start("visible");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [outerControls, pupilControls, onMouseLeave],
  );

  const outerVariants: Variants = {
   visible: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0.6, 1],
    transition: { duration: 0.9 * duration, ease: "easeInOut" },
   },
  };

  const pupilVariants: Variants = {
   visible: { scale: 1, opacity: 1 },
   animate: {
    scale: [1, 1.4, 1],
    opacity: [1, 0.9, 1],
    transition: { duration: 0.6 * duration, ease: "easeInOut" },
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
      variants={outerVariants}
      initial="visible"
      animate={outerControls}
     />
     <motion.circle
      cx="12"
      cy="12"
      r="3"
      variants={pupilVariants}
      initial="visible"
      animate={pupilControls}
     />
    </svg>
   </motion.div>
  );
 },
);

EyeIcon.displayName = "EyeIcon";
export { EyeIcon };
