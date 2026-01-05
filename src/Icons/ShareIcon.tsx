"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ShareIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ShareIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const ShareIcon = forwardRef<ShareIconHandle, ShareIconProps>(
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

  const nodeVariants = (delay: number): Variants => ({
   normal: {
    scale: 1,
    opacity: 1,
   },
   animate: {
    scale: [1, 1.15, 1],
    opacity: [0.7, 1],
    transition: {
     duration: 0.45 * duration,
     ease: [0.22, 1, 0.36, 1],
     delay,
    },
   },
  });

  const lineVariants: Variants = {
   normal: {
    opacity: 1,
   },
   animate: {
    opacity: [0.4, 1],
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
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     animate={controls}
     initial="normal"
    >
     <motion.circle cx="18" cy="5" r="3" variants={nodeVariants(0)} />
     <motion.circle cx="6" cy="12" r="3" variants={nodeVariants(0.12)} />
     <motion.circle cx="18" cy="19" r="3" variants={nodeVariants(0.24)} />

     <motion.line
      x1="8.59"
      y1="13.51"
      x2="15.42"
      y2="17.49"
      variants={lineVariants}
     />
     <motion.line
      x1="15.41"
      y1="6.51"
      x2="8.59"
      y2="10.49"
      variants={lineVariants}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

ShareIcon.displayName = "ShareIcon";
export { ShareIcon };
