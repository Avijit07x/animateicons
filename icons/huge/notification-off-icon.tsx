"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface NotificationOffIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface NotificationOffIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const NotificationOffIcon = forwardRef<
 NotificationOffIconHandle,
 NotificationOffIconProps
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
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const bellVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -10, 8, -5, 3, -1, 0],
    transition: {
     duration: 1.4 * duration,
     ease: "easeInOut",
    },
   },
  };

  const clapperVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, -2, 2, -1, 1, 0],
    transition: {
     duration: 1.4 * duration,
     ease: "easeInOut",
    },
   },
  };

  return (
   <motion.div
    className={cn("relative inline-flex", className)}
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
     variants={bellVariants}
     style={{ originX: 0.5, originY: 0.15 }}
    >
     <motion.path
      d="M15.5 18C15.5 19.933 13.933 21.5 12 21.5C10.067 21.5 8.5 19.933 8.5 18"
      variants={clapperVariants}
     />

     <path d="M2 2L22 22" />

     <path d="M21 16.2311C21 15.762 20.8136 15.3121 20.4819 14.9803L19.8787 14.3771C19.3161 13.8145 19 13.0514 19 12.2558V9.5C19 5.634 15.866 2.5 12 2.5C10.4497 2.5 9.01706 3.00399 7.85707 3.85707M4.76887 18C3.79195 18 3 17.208 3 16.2311C3 15.762 3.18636 15.3121 3.51809 14.9803L4.12132 14.3771C4.68393 13.8145 5 13.0514 5 12.2558V9.5C5 8.20839 5.34981 6.99849 5.95987 5.95987L18 18H4.76887Z" />
    </motion.svg>
   </motion.div>
  );
 },
);

NotificationOffIcon.displayName = "NotificationOffIcon";
export { NotificationOffIcon };
