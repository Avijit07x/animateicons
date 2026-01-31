"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface PaperclipIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PaperclipIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const PaperclipIcon = forwardRef<PaperclipIconHandle, PaperclipIconProps>(
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
  const pathControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () =>
     reduced ? pathControls.start("normal") : pathControls.start("animate"),
    stopAnimation: () => pathControls.start("normal"),
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     pathControls.start("animate");
    } else onMouseEnter?.(e as any);
   },
   [pathControls, reduced, onMouseEnter, isAnimated],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     pathControls.start("normal");
    } else onMouseLeave?.(e as any);
   },
   [pathControls, onMouseLeave],
  );

  const pathVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [360, 0],
    transition: { duration: 1.2 * duration, ease: "easeInOut" },
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
      d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"
      initial="normal"
      animate={pathControls}
      variants={pathVariants}
      style={{ strokeDasharray: 360, strokeLinecap: "round" }}
     />
    </svg>
   </motion.div>
  );
 },
);

PaperclipIcon.displayName = "PaperclipIcon";
export { PaperclipIcon };
