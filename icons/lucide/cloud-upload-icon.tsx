"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface CloudUploadHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CloudUploadProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const CloudUploadIcon = forwardRef<CloudUploadHandle, CloudUploadProps>(
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

  const cloudVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [100, 0],
    opacity: [0.4, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut" as const,
    },
   },
  };

  const shaftVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [30, 0],
    opacity: [0.5, 1],
    transition: {
     duration: 0.55 * duration,
     ease: "easeInOut" as const,
     delay: 0.05,
    },
   },
  };

  const headVariants: Variants = {
   normal: { y: 0, scale: 1, opacity: 1 },
   animate: {
    y: [2, -2, 0],
    scale: [1, 1.06, 1],
    opacity: [0.7, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut" as const,
     delay: 0.1,
    },
   },
  };

  const groupPulse: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.02, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut" as const,
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
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     className="lucide lucide-cloud-upload-icon lucide-cloud-upload"
    >
     <motion.g variants={groupPulse} initial="normal" animate={controls}>
      <motion.path
       d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"
       strokeDasharray="100"
       strokeDashoffset="100"
       variants={cloudVariants}
       initial="normal"
       animate={controls}
      />
      <motion.path
       d="M12 13v8"
       strokeDasharray="30"
       strokeDashoffset="30"
       variants={shaftVariants}
       initial="normal"
       animate={controls}
      />
      <motion.path
       d="m8 17 4-4 4 4"
       variants={headVariants}
       initial="normal"
       animate={controls}
      />
     </motion.g>
    </motion.svg>
   </motion.div>
  );
 },
);

CloudUploadIcon.displayName = "CloudUploadIcon";
export { CloudUploadIcon };
