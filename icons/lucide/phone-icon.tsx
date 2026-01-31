"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface PhoneHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PhoneProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const PhoneIcon = forwardRef<PhoneHandle, PhoneProps>(
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

  const phoneVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -8, 8, -6, 6, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
    },
   },
  };

  const pulseVariants: Variants = {
   normal: { opacity: 0, scale: 0.3 },
   animate: {
    opacity: [0, 0.25, 0],
    scale: [0.3, 1.5],
    transition: {
     duration: 0.9 * duration,
     ease: "easeOut",
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
    >
     <motion.circle
      cx="12"
      cy="12"
      r="10"
      fill="none"
      variants={pulseVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
      variants={phoneVariants}
      initial="normal"
      animate={controls}
      style={{
       transformBox: "fill-box",
       transformOrigin: "center",
      }}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

PhoneIcon.displayName = "PhoneIcon";
export { PhoneIcon };
