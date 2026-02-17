"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface LoaderIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LoaderIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const LoaderIcon = forwardRef<LoaderIconHandle, LoaderIconProps>(
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

  const wrapperVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0.3 * duration } },
   animate: {
    rotate: 360,
    scale: [1, 1.1, 1],
    transition: {
     rotate: { duration: 1 * duration, ease: "linear", repeat: Infinity },
     scale: {
      duration: 0.6 * duration,
      repeat: Infinity,
      repeatType: "mirror",
     },
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
     variants={wrapperVariants}
     animate={controls}
     initial="normal"
    >
     <motion.path d="M12 2v4" />
     <motion.path d="m16.2 7.8 2.9-2.9" />
     <motion.path d="M18 12h4" />
     <motion.path d="m16.2 16.2 2.9 2.9" />
     <motion.path d="M12 18v4" />
     <motion.path d="m4.9 19.1 2.9-2.9" />
     <motion.path d="M2 12h4" />
     <motion.path d="m4.9 4.9 2.9 2.9" />
    </motion.svg>
   </motion.div>
  );
 },
);

LoaderIcon.displayName = "LoaderIcon";
export { LoaderIcon };
