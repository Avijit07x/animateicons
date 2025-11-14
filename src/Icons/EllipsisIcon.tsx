"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface EllipsisIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface EllipsisIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const EllipsisIcon = forwardRef<EllipsisIconHandle, EllipsisIconProps>(
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
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     controls.start("animate");
    } else {
     onMouseEnter?.(e);
    }
   },
   [controls, onMouseEnter, reduced],
  );

  const handleLeave = useCallback(
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     controls.start("normal");
    } else {
     onMouseLeave?.(e);
    }
   },
   [controls, onMouseLeave],
  );

  const dotVariants: Variants = {
   normal: { opacity: 1 },
   animate: (i) => ({
    opacity: [0.4, 0.8, 1, 0.8, 0.4, 1],
    transition: {
     duration: 0.8 * duration,
     repeat: 0,
     delay: i * 0.2,
     ease: "easeInOut",
    },
   }),
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
     initial="normal"
     animate={controls}
    >
     <motion.circle cx="12" cy="12" r="1" variants={dotVariants} custom={0} />
     <motion.circle cx="19" cy="12" r="1" variants={dotVariants} custom={1} />
     <motion.circle cx="5" cy="12" r="1" variants={dotVariants} custom={2} />
    </motion.svg>
   </motion.div>
  );
 },
);

EllipsisIcon.displayName = "EllipsisIcon";
export { EllipsisIcon };
