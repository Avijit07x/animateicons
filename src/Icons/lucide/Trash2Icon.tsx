"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface Trash2IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Trash2IconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const Trash2Icon = forwardRef<Trash2IconHandle, Trash2IconProps>(
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
  const binControls = useAnimation();
  const lidControls = useAnimation();
  const barControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () => {
     if (reduced) {
      binControls.start("normal");
      lidControls.start("normal");
      barControls.start("normal");
     } else {
      binControls.start("animate");
      lidControls.start("animate");
      barControls.start("animate");
     }
    },
    stopAnimation: () => {
     binControls.start("normal");
     lidControls.start("normal");
     barControls.start("normal");
    },
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     binControls.start("animate");
     lidControls.start("animate");
     barControls.start("animate");
    } else {
     onMouseEnter?.(e as any);
    }
   },
   [binControls, lidControls, barControls, reduced, onMouseEnter, isAnimated],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     binControls.start("normal");
     lidControls.start("normal");
     barControls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [binControls, lidControls, barControls, onMouseLeave],
  );

  const binVariants: Variants = {
   normal: { scale: 1, rotate: 0, y: 0 },
   animate: {
    scale: [1, 1.05, 0.97, 1],
    rotate: [0, -2, 2, 0],
    y: [0, -1.5, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const lidVariants: Variants = {
   normal: { rotate: 0, y: 0, transformOrigin: "12px 4px" },
   animate: {
    rotate: [-15, 5, 0],
    y: [-2, 0],
    transition: { duration: 0.7 * duration, ease: "easeOut", delay: 0.1 },
   },
  };

  const barVariants: Variants = {
   normal: { scaleY: 1, opacity: 1, transformOrigin: "center bottom" },
   animate: {
    scaleY: [1, 1.2, 1],
    opacity: [1, 0.9, 1],
    transition: { duration: 0.6 * duration, ease: "easeInOut", delay: 0.2 },
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
      d="M10 11v6"
      animate={barControls}
      initial="normal"
      variants={barVariants}
     />
     <motion.path
      d="M14 11v6"
      animate={barControls}
      initial="normal"
      variants={barVariants}
     />
     <motion.path
      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
      animate={binControls}
      initial="normal"
      variants={binVariants}
     />
     <motion.path d="M3 6h18" stroke="currentColor" />
     <motion.path
      d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
      animate={lidControls}
      initial="normal"
      variants={lidVariants}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

Trash2Icon.displayName = "Trash2Icon";
export { Trash2Icon };
