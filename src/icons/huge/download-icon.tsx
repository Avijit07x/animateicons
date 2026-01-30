"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface DownloadIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface DownloadIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const DownloadIcon = forwardRef<DownloadIconHandle, DownloadIconProps>(
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

  const shaftVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [24, 0],
    opacity: [0.4, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
    },
   },
  };

  const headVariants: Variants = {
   normal: { y: 0, scale: 1, opacity: 1 },
   animate: {
    y: [-2, 2, 0],
    scale: [1, 1.05, 1],
    opacity: [0.6, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     delay: 0.05 * duration,
    },
   },
  };

  const trayVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [40, 0],
    opacity: [0.3, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
    },
   },
  };

  const groupPulse: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.02, 1],
    transition: {
     duration: 0.6 * duration,
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
    <motion.svg
     xmlns="http://www.w3.org/2000/svg"
     width={size}
     height={size}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="1.5"
     strokeLinecap="round"
     strokeLinejoin="round"
    >
     <motion.g variants={groupPulse} initial="normal" animate={controls}>
      <motion.path
       d="M11.9997 15.0002V3.00016"
       strokeDasharray="24"
       strokeDashoffset="24"
       variants={shaftVariants}
       initial="normal"
       animate={controls}
      />
      <motion.path
       d="M16.4998 11.5002C16.4998 11.5002 13.1856 16.0002 11.9997 16.0002C10.8139 16.0002 7.49976 11.5002 7.49976 11.5002"
       variants={headVariants}
       initial="normal"
       animate={controls}
      />
      <motion.path
       d="M2.99969 17.0002C2.99969 17.9302 2.99969 18.3952 3.10192 18.7767C3.37932 19.8119 4.18796 20.6206 5.22324 20.898C5.60474 21.0002 6.06972 21.0002 6.99969 21.0002L16.9997 21.0002C17.9297 21.0002 18.3947 21.0002 18.7762 20.898C19.8114 20.6206 20.6201 19.8119 20.8975 18.7767C20.9997 18.3952 20.9997 17.9302 20.9997 17.0002"
       strokeDasharray="40"
       strokeDashoffset="40"
       variants={trayVariants}
       initial="normal"
       animate={controls}
      />
     </motion.g>
    </motion.svg>
   </motion.div>
  );
 },
);

DownloadIcon.displayName = "DownloadIcon";
export { DownloadIcon };
