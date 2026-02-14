"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface Dashboard02IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Dashboard02IconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const Dashboard02Icon = forwardRef<Dashboard02IconHandle, Dashboard02IconProps>(
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

  const gridVariants: Variants = {
   normal: { scale: 1, rotate: 0 },
   animate: {
    scale: [1, 1.04, 1],
    rotate: [0, 1, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
    },
   },
  };

  const tileVariants: Variants = {
   normal: { opacity: 1, scale: 1 },
   animate: (i: number) => ({
    opacity: [0.5, 1],
    scale: [0.9, 1.08, 1],
    transition: {
     duration: 0.55 * duration,
     delay: 0.08 * i,
     ease: "easeOut",
    },
   }),
  };

  const sweepVariants: Variants = {
   normal: { x: -26, y: -26, opacity: 0 },
   animate: {
    x: [-26, 26],
    y: [-26, 26],
    opacity: [0, 0.25, 0],
    transition: {
     duration: 0.8 * duration,
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
     strokeLinecap="square"
     strokeLinejoin="round"
    >
     <defs>
      <linearGradient id="grid-sweep" x1="0" y1="0" x2="1" y2="1">
       <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
       <stop offset="50%" stopColor="currentColor" stopOpacity="0.25" />
       <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </linearGradient>
     </defs>

     <motion.g variants={gridVariants} initial="normal" animate={controls}>
      <motion.g
       variants={tileVariants}
       custom={0}
       initial="normal"
       animate={controls}
      >
       <path d="M3.1903 8.95671C3 8.49728 3 7.91485 3 6.75C3 5.58515 3 5.00272 3.1903 4.54329C3.44404 3.93072 3.93072 3.44404 4.54329 3.1903C5.00272 3 5.58515 3 6.75 3C7.91485 3 8.49728 3 8.95671 3.1903C9.56928 3.44404 10.056 3.93072 10.3097 4.54329C10.5 5.00272 10.5 5.58515 10.5 6.75C10.5 7.91485 10.5 8.49728 10.3097 8.95671C10.056 9.56928 9.56928 10.056 8.95671 10.3097C8.49728 10.5 7.91485 10.5 6.75 10.5C5.58515 10.5 5.00272 10.5 4.54329 10.3097C3.93072 10.056 3.44404 9.56928 3.1903 8.95671Z" />
      </motion.g>

      <motion.g
       variants={tileVariants}
       custom={1}
       initial="normal"
       animate={controls}
      >
       <path d="M13.6903 8.95671C13.5 8.49728 13.5 7.91485 13.5 6.75C13.5 5.58515 13.5 5.00272 13.6903 4.54329C13.944 3.93072 14.4307 3.44404 15.0433 3.1903C15.5027 3 16.0851 3 17.25 3C18.4149 3 18.9973 3 19.4567 3.1903C20.0693 3.44404 20.556 3.93072 20.8097 4.54329C21 5.00272 21 5.58515 21 6.75C21 7.91485 21 8.49728 20.8097 8.95671C20.556 9.56928 20.0693 10.056 19.4567 10.3097C18.9973 10.5 18.4149 10.5 17.25 10.5C16.0851 10.5 15.5027 10.5 15.0433 10.3097C14.4307 10.056 13.944 9.56928 13.6903 8.95671Z" />
      </motion.g>

      <motion.g
       variants={tileVariants}
       custom={2}
       initial="normal"
       animate={controls}
      >
       <path d="M13.6903 19.4567C13.5 18.9973 13.5 18.4149 13.5 17.25C13.5 16.0851 13.5 15.5027 13.6903 15.0433C13.944 14.4307 14.4307 13.944 15.0433 13.6903C15.5027 13.5 16.0851 13.5 17.25 13.5C18.4149 13.5 18.9973 13.5 19.4567 13.6903C20.0693 13.944 20.556 14.4307 20.8097 15.0433C21 15.5027 21 16.0851 21 17.25C21 18.4149 21 18.9973 20.8097 19.4567C20.556 20.0693 20.0693 20.556 19.4567 20.8097C18.9973 21 18.4149 21 17.25 21C16.0851 21 15.5027 21 15.0433 20.8097C14.4307 20.556 13.944 20.0693 13.6903 19.4567Z" />
      </motion.g>

      <motion.g
       variants={tileVariants}
       custom={3}
       initial="normal"
       animate={controls}
      >
       <path d="M3.1903 19.4567C3 18.9973 3 18.4149 3 17.25C3 16.0851 3 15.5027 3.1903 15.0433C3.44404 14.4307 3.93072 13.944 4.54329 13.6903C5.00272 13.5 5.58515 13.5 6.75 13.5C7.91485 13.5 8.49728 13.5 8.95671 13.6903C9.56928 13.944 10.056 14.4307 10.3097 15.0433C10.5 15.5027 10.5 16.0851 10.5 17.25C10.5 18.4149 10.5 18.9973 10.3097 19.4567C10.056 20.0693 9.56928 20.556 8.95671 20.8097C8.49728 21 7.91485 21 6.75 21C5.58515 21 5.00272 21 4.54329 20.8097C3.93072 20.556 3.44404 20.0693 3.1903 19.4567Z" />
      </motion.g>

      <motion.rect
       x="2"
       y="2"
       width="20"
       height="20"
       rx="3"
       fill="url(#grid-sweep)"
       variants={sweepVariants}
       initial="normal"
       animate={controls}
       style={{ pointerEvents: "none" }}
      />
     </motion.g>
    </motion.svg>
   </motion.div>
  );
 },
);

Dashboard02Icon.displayName = "Dashboard02Icon";
export { Dashboard02Icon };
