"use client";

import { cn } from "@/lib/utils";
import type { Variants } from "motion/react";
import {
 LazyMotion,
 domMin,
 m,
 useAnimation,
 useReducedMotion,
} from "motion/react";
import {
 forwardRef,
 useCallback,
 useImperativeHandle,
 useRef,
 type HTMLAttributes,
} from "react";
export interface CloudRainWindIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CloudRainWindIconProps extends Omit<
 HTMLAttributes<HTMLDivElement>,
 | "color"
 | "onDrag"
 | "onDragStart"
 | "onDragEnd"
 | "onAnimationStart"
 | "onAnimationEnd"
 | "onAnimationIteration"
> {
 size?: number;
 duration?: number;
 isAnimated?: boolean;
 color?: string;
}

const CloudRainWindIcon = forwardRef<
 CloudRainWindIconHandle,
 CloudRainWindIconProps
>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 1,
   isAnimated = true,
   color,
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

  const cloudVariants: Variants = {
   normal: { x: 0, pathLength: 1, opacity: 1 },
   animate: (i: number) => ({
    x: [-6, 0],
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     x: {
      duration: 0.6 * duration,
      delay: i * 0.1 * duration,
      ease: [0.34, 1.2, 0.64, 1],
     },
     pathLength: {
      duration: 0.5 * duration,
      delay: i * 0.1 * duration,
      ease: [0.16, 1, 0.3, 1],
     },
     opacity: { duration: 0.2 * duration, delay: i * 0.1 * duration },
    },
   }),
  };

  const dropVariants: Variants = {
   normal: { y: 0, opacity: 1 },
   animate: (i: number) => ({
    y: [-4, 0],
    opacity: [0, 1],
    transition: {
     duration: 0.45 * duration,
     delay: (0.4 + i * 0.1) * duration,
     ease: [0.34, 1.2, 0.6, 1],
    },
   }),
  };

  return (
   <LazyMotion features={domMin} strict>
    <m.div
     className={cn("inline-flex items-center justify-center", className)}
     onMouseEnter={handleEnter}
     onMouseLeave={handleLeave}
     {...props}
     style={{ color, ...props.style }}
    >
     <m.svg
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
     >
      <m.path
       d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"
       custom={0}
       variants={cloudVariants}
      />
      <m.path d="m9 13-3 7" custom={0} variants={dropVariants} />
      <m.path d="m17 13-3 7" custom={1} variants={dropVariants} />
      <m.path d="m9.2 22 3-7" custom={2} variants={dropVariants} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CloudRainWindIcon.displayName = "CloudRainWindIcon";
export { CloudRainWindIcon };
