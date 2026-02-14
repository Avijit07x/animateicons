"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface Loading02IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Loading02IconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const Loading02Icon = forwardRef<Loading02IconHandle, Loading02IconProps>(
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

  const loaderVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0.3 * duration } },
   animate: {
    rotate: 360,
    scale: [1, 1.1, 1],
    transition: {
     rotate: { duration: 1 * duration, ease: "linear", repeat: Infinity },
     scale: {
      duration: 0.6 * duration,
      repeat: Infinity,
      repeatType: "mirror",
     },
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
     initial="normal"
     animate={controls}
     variants={loaderVariants}
     style={{ transformOrigin: "center" }}
    >
     <path d="M18.001 20C16.3295 21.2558 14.2516 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 12.8634 21.8906 13.7011 21.6849 14.5003C21.4617 15.3673 20.5145 15.77 19.6699 15.4728C18.9519 15.2201 18.6221 14.3997 18.802 13.66C18.9314 13.1279 19 12.572 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C13.3197 19 14.554 18.6348 15.6076 18" />
    </motion.svg>
   </motion.div>
  );
 },
);

Loading02Icon.displayName = "Loading02Icon";
export { Loading02Icon };
