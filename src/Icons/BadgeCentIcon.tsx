"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BadgeCentIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BadgeCentIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const BadgeCentIcon = forwardRef<BadgeCentIconHandle, BadgeCentIconProps>(
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
  const lineControls = useAnimation();
  const semiControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () => {
     if (reduced) {
      outerControls.start("normal");
      lineControls.start("normal");
      semiControls.start("normal");
     } else {
      outerControls.start("animate");
      lineControls.start("animate");
      semiControls.start("animate");
     }
    },
    stopAnimation: () => {
     outerControls.start("normal");
     lineControls.start("normal");
     semiControls.start("normal");
    },
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     outerControls.start("animate");
     lineControls.start("animate");
     semiControls.start("animate");
    } else onMouseEnter?.(e as any);
   },
   [outerControls, lineControls, semiControls, reduced, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     outerControls.start("normal");
     lineControls.start("normal");
     semiControls.start("normal");
    } else onMouseLeave?.(e as any);
   },
   [outerControls, lineControls, semiControls, onMouseLeave],
  );

  const outerVariants: Variants = {
   normal: { strokeDashoffset: 0, scale: 1 },
   animate: {
    strokeDashoffset: [260, 20, 0],
    scale: [1, 0.985, 1.03, 1],
    transition: {
     duration: 1.2 * duration,
     ease: [0.2, 0.85, 0.25, 1],
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const lineVariants: Variants = {
   normal: { strokeDashoffset: 0, scaleY: 1, opacity: 1 },
   animate: {
    strokeDashoffset: [16, 0],
    scaleY: [1, 1.16, 0.98, 1],
    opacity: [0.9, 1, 1],
    transition: {
     duration: 0.8 * duration,
     ease: [0.22, 0.9, 0.28, 1],
     delay: 0.18,
    },
   },
  };

  const semiVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [80, 0],
    opacity: [0, 1],
    transition: {
     duration: 0.9 * duration,
     ease: [0.22, 0.8, 0.2, 1],
     delay: 0.32,
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
      d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
      initial="normal"
      animate={outerControls}
      variants={outerVariants}
      style={{ strokeDasharray: 260, transformOrigin: "12px 12px" }}
     />
     <motion.path
      d="M12 7v10"
      initial="normal"
      animate={lineControls}
      variants={lineVariants}
      style={{
       strokeDasharray: 16,
       strokeLinecap: "round",
       transformOrigin: "12px 12px",
      }}
     />
     <motion.path
      d="M15.4 10a4 4 0 1 0 0 4"
      initial="normal"
      animate={semiControls}
      variants={semiVariants}
      style={{ strokeDasharray: 80, strokeLinecap: "round" }}
     />
    </svg>
   </motion.div>
  );
 },
);

BadgeCentIcon.displayName = "BadgeCentIcon";
export { BadgeCentIcon };
