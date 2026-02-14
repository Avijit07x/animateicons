"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface Menu02IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Menu02IconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const Menu02Icon = forwardRef<Menu02IconHandle, Menu02IconProps>(
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

  const topVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: 6,
    transition: {
     type: "spring",
     stiffness: 300,
     damping: 18,
     delay: 0,
     duration: 0.4 * duration,
    },
   },
  };

  const middleVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: 10,
    transition: {
     type: "spring",
     stiffness: 300,
     damping: 18,
     delay: 0.05 * duration,
     duration: 0.4 * duration,
    },
   },
  };

  const bottomVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: 6,
    transition: {
     type: "spring",
     stiffness: 300,
     damping: 18,
     delay: 0.1 * duration,
     duration: 0.4 * duration,
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
      d="M20 5L4 5"
      variants={topVariants}
      style={{ transformOrigin: "right center" }}
     />

     <motion.path
      d="M20 12L10 12"
      variants={middleVariants}
      style={{ transformOrigin: "right center" }}
     />

     <motion.path
      d="M20 19L4 19"
      variants={bottomVariants}
      style={{ transformOrigin: "right center" }}
     />
    </motion.svg>
   </motion.div>
  );
 },
);

Menu02Icon.displayName = "Menu02Icon";
export { Menu02Icon };
