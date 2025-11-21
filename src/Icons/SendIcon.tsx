"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface SendIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SendIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const SendIcon = forwardRef<SendIconHandle, SendIconProps>(
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

  const svgVariants: Variants = {
   normal: { rotate: 0, x: 0, y: 0, scale: 1 },
   animate: {
    rotate: [0, -5, 2, 0],
    x: [0, 4, -1, 0],
    y: [0, -2, 0, 0],
    scale: [1, 1.04, 1, 1],
    transition: {
     duration: 1.2 * duration,
     ease: "easeInOut",
     when: "beforeChildren",
     staggerChildren: 0.08,
     repeat: 0,
    },
   },
  };

  const trailVariants: Variants = {
   normal: { opacity: 0, x: 0, scaleX: 1, originX: 1 },
   animate: {
    opacity: [0, 0.5, 0],
    x: [-4, -6, -8],
    scaleX: [0.8, 1, 1.1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeOut",
     repeat: 0,
     delay: 0.05,
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
     variants={svgVariants}
    >
     <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
     <path d="m21.854 2.147-10.94 10.939" />
     <motion.line
      x1="6"
      y1="12"
      x2="11"
      y2="12"
      stroke="currentColor"
      strokeWidth="2"
      variants={trailVariants}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

SendIcon.displayName = "SendIcon";
export { SendIcon };
