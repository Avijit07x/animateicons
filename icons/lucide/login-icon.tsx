"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface LoginIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LoginIconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const LoginIcon = forwardRef<LoginIconHandle, LoginIconProps>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 28,
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
   normal: { scale: 1, rotate: 0 },
   animate: {
    scale: [1, 1.1, 0.95, 1],
    rotate: [0, -3, 2, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
    },
   },
  };

  const arrowVariants: Variants = {
   normal: { x: 0, opacity: 1 },
   animate: {
    x: [-8, 2, 0],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeOut",
    },
   },
  };

  const doorVariants: Variants = {
   normal: { pathLength: 1 },
   animate: {
    pathLength: [0, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     delay: 0.1,
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
     variants={iconVariants}
    >
     <motion.path d="m10 17 5-5-5-5" variants={arrowVariants} />
     <motion.path d="M15 12H3" variants={arrowVariants} />

     <motion.path
      d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
      variants={doorVariants}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

LoginIcon.displayName = "LoginIcon";
export { LoginIcon };
