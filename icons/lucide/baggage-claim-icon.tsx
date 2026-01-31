"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface BaggageClaimIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BaggageClaimIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const BaggageClaimIcon = forwardRef<
 BaggageClaimIconHandle,
 BaggageClaimIconProps
>(
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

  const iconVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.03, 1],
    transition: {
     duration: 0.6 * duration,
     ease: [0.22, 1, 0.36, 1],
    },
   },
  };

  const beltVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, -2, 2, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
    },
   },
  };

  const bagVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -2, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     delay: 0.1,
    },
   },
  };

  const wheelVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, 360],
    transition: {
     duration: 0.6 * duration,
     ease: "linear",
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
     initial="normal"
     animate={controls}
     variants={iconVariants}
    >
     <motion.path
      d="M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2"
      variants={beltVariants}
     />
     <motion.path
      d="M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10"
      variants={bagVariants}
     />
     <motion.rect
      width="13"
      height="8"
      x="8"
      y="6"
      rx="1"
      variants={bagVariants}
     />
     <motion.circle cx="18" cy="20" r="2" variants={wheelVariants} />
     <motion.circle cx="9" cy="20" r="2" variants={wheelVariants} />
    </motion.svg>
   </motion.div>
  );
 },
);

BaggageClaimIcon.displayName = "BaggageClaimIcon";
export { BaggageClaimIcon };
