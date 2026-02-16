"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ActivityIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ActivityIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const ActivityIcon = forwardRef<ActivityIconHandle, ActivityIconProps>(
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
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     controls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [controls, onMouseLeave],
  );

  const activityVariants: Variants = {
   normal: {
    strokeDasharray: "none",
    strokeDashoffset: 0,
    opacity: 1,
   },
   animate: {
    strokeDasharray: "60 120",
    strokeDashoffset: [0, -180],
    transition: {
     duration: 1.4 * duration,
     ease: "linear",
     repeat: Infinity,
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
    >
     <motion.path
      d="M3.00012 12H7.34073C7.74075 12 8.10229 12.2384 8.25987 12.6061L10.8436 18.6348C10.9386 18.8563 11.1564 19 11.3975 19C11.7303 19 12.0001 18.7302 12.0001 18.3974V5.60262C12.0001 5.2698 12.2699 5 12.6027 5C12.8438 5 13.0617 5.14367 13.1566 5.36526L15.74 11.3939C15.8976 11.7616 16.2591 12 16.6592 12H20.9998"
      variants={activityVariants}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

ActivityIcon.displayName = "ActivityIcon";
export { ActivityIcon };
