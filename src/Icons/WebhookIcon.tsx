"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface WebhookHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface WebhookProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const WebhookIcon = forwardRef<WebhookHandle, WebhookProps>(
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
   normal: {
    scale: 1,
    opacity: 1,
   },
   animate: {
    scale: [1, 1.06, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeOut",
    },
   },
  };

  const pathVariants: Variants = {
   normal: {
    strokeDasharray: "0 1",
    opacity: 1,
   },
   animate: {
    strokeDasharray: ["0 1", "20 6", "0 1"],
    opacity: [0.6, 1, 0.6],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     repeat: 1,
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
     <motion.path
      d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"
      variants={pathVariants}
     />
     <motion.path
      d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"
      variants={pathVariants}
     />
     <motion.path
      d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"
      variants={pathVariants}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

WebhookIcon.displayName = "WebhookIcon";
export { WebhookIcon };
