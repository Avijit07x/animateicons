"use client";

import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { cn } from "../../lib/utils";

export interface Dashboard03IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Dashboard03IconProps extends HTMLMotionProps<"div"> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
}

const Dashboard03Icon = forwardRef<Dashboard03IconHandle, Dashboard03IconProps>(
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
     strokeLinejoin="round"
    >
     <defs>
      <linearGradient id="dashboard03-sweep" x1="0" y1="0" x2="1" y2="1">
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
       <path d="M10.5 6.75C10.5 4.67893 8.82107 3 6.75 3C4.67893 3 3 4.67893 3 6.75C3 8.82107 4.67893 10.5 6.75 10.5C8.82107 10.5 10.5 8.82107 10.5 6.75Z" />
      </motion.g>

      <motion.g
       variants={tileVariants}
       custom={1}
       initial="normal"
       animate={controls}
      >
       <path d="M21 6.75C21 4.67893 19.3211 3 17.25 3C15.1789 3 13.5 4.67893 13.5 6.75C13.5 8.82107 15.1789 10.5 17.25 10.5C19.3211 10.5 21 8.82107 21 6.75Z" />
      </motion.g>

      <motion.g
       variants={tileVariants}
       custom={2}
       initial="normal"
       animate={controls}
      >
       <path d="M21 17.25C21 15.1789 19.3211 13.5 17.25 13.5C15.1789 13.5 13.5 15.1789 13.5 17.25C13.5 19.3211 15.1789 21 17.25 21C19.3211 21 21 19.3211 21 17.25Z" />
      </motion.g>

      <motion.g
       variants={tileVariants}
       custom={3}
       initial="normal"
       animate={controls}
      >
       <path d="M10.5 17.25C10.5 15.1789 8.82107 13.5 6.75 13.5C4.67893 13.5 3 15.1789 3 17.25C3 19.3211 4.67893 21 6.75 21C8.82107 21 10.5 19.3211 10.5 17.25Z" />
      </motion.g>

      <motion.rect
       x="2"
       y="2"
       width="20"
       height="20"
       rx="6"
       fill="url(#dashboard03-sweep)"
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

Dashboard03Icon.displayName = "Dashboard03Icon";
export { Dashboard03Icon };
