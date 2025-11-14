"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface SignalHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SignalProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const SignalIcon = forwardRef<SignalHandle, SignalProps>(
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

  const handleEnter = useCallback(() => {
   if (!isAnimated || reduced) return;
   if (!isControlled.current) controls.start("animate");
  }, [controls, reduced]);

  const handleLeave = useCallback(() => {
   if (!isControlled.current) controls.start("normal");
  }, [controls]);

  const svgVariants: Variants = {
   normal: { scale: 1, rotate: 0 },
   animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 1 * duration, ease: "easeInOut" },
   },
  };

  const dotVariants: Variants = {
   normal: { scale: 1, opacity: 0.8 },
   animate: {
    scale: [1, 1.3, 1],
    opacity: [0.5, 1, 0.8],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  const barPulse = (delay: number): Variants => ({
   normal: { scaleY: 1, opacity: 0.9, transformOrigin: "center bottom" },
   animate: {
    scaleY: [1, 1.4, 0.95, 1],
    opacity: [0.8, 1, 0.85, 1],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     delay,
    },
   },
  });

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
     variants={svgVariants}
    >
     <motion.path
      d="M2 20h.01"
      variants={dotVariants}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M7 20v-4"
      variants={barPulse(0.1)}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M12 20v-8"
      variants={barPulse(0.25)}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M17 20V8"
      variants={barPulse(0.4)}
      initial="normal"
      animate={controls}
     />
     <motion.path
      d="M22 4v16"
      variants={barPulse(0.55)}
      initial="normal"
      animate={controls}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

SignalIcon.displayName = "SignalIcon";
export { SignalIcon };
