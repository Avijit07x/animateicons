"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface TriangleAlertIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface TriangleAlertIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const TriangleAlertIcon = forwardRef<
 TriangleAlertIconHandle,
 TriangleAlertIconProps
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
    if (!isControlled.current) {
     controls.start("animate");
    } else {
     onMouseEnter?.(e as any);
    }
   },
   [controls, reduced, isAnimated, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     controls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [controls, onMouseLeave],
  );

  const svgVariants: Variants = {
   normal: { x: 0, scale: 1 },
   animate: {
    x: [0, -2, 2, -2, 2, 0],
    scale: [1, 1.08, 1],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
    },
   },
  };

  const triangleVariants: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [0.5, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeOut",
    },
   },
  };

  const lineVariants: Variants = {
   normal: { scaleY: 1, opacity: 1 },
   animate: {
    scaleY: [0.4, 1.3, 1],
    opacity: [0.4, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeOut",
     delay: 0.15 * duration,
    },
   },
  };

  const dotVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: {
    scale: [0.3, 1.6, 1],
    opacity: [0.3, 1],
    transition: {
     duration: 0.3 * duration,
     ease: "easeOut",
     delay: 0.25 * duration,
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
     strokeWidth={2}
     strokeLinecap="round"
     strokeLinejoin="round"
     animate={controls}
     initial="normal"
     variants={svgVariants}
    >
     <motion.path
      d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
      variants={triangleVariants}
     />
     <motion.path d="M12 9v4" variants={lineVariants} style={{ originY: 0 }} />
     <motion.path d="M12 17h.01" variants={dotVariants} />
    </motion.svg>
   </motion.div>
  );
 },
);

TriangleAlertIcon.displayName = "TriangleAlertIcon";
export { TriangleAlertIcon };
