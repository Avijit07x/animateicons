"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ExternalLinkIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface EyeOffIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const EyeOffIcon = forwardRef<ExternalLinkIconHandle, EyeOffIconProps>(
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
  const arcControls = useAnimation();
  const slashControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () => {
     if (reduced) {
      arcControls.start("normal");
      slashControls.start("normal");
     } else {
      arcControls.start("animate");
      slashControls.start("animate");
     }
    },
    stopAnimation: () => {
     arcControls.start("normal");
     slashControls.start("normal");
    },
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     arcControls.start("animate");
     slashControls.start("animate");
    } else onMouseEnter?.(e as any);
   },
   [arcControls, slashControls, isAnimated, reduced, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     arcControls.start("normal");
     slashControls.start("normal");
    } else onMouseLeave?.(e as any);
   },
   [arcControls, slashControls, onMouseLeave],
  );

  const arcVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0.6, 1],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const slashVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1, 0.85, 1],
    opacity: [0.4, 1, 0.9, 1],
    transition: { duration: 1 * duration, ease: "easeInOut" },
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
      d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
      variants={arcVariants}
      initial="normal"
      animate={arcControls}
     />
     <motion.path
      d="M14.084 14.158a3 3 0 0 1-4.242-4.242"
      variants={arcVariants}
      initial="normal"
      animate={arcControls}
     />
     <motion.path
      d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
      variants={arcVariants}
      initial="normal"
      animate={arcControls}
     />
     <motion.path
      d="m2 2 20 20"
      variants={slashVariants}
      initial="normal"
      animate={slashControls}
     />
    </svg>
   </motion.div>
  );
 },
);

EyeOffIcon.displayName = "EyeOffIcon";
export { EyeOffIcon };
