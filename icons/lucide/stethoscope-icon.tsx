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
export interface StethoscopeIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface StethoscopeIconProps extends Omit<
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

const StethoscopeIcon = forwardRef<StethoscopeIconHandle, StethoscopeIconProps>(
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
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const earVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.3, 1],
    transition: { duration: 0.3 * duration, ease: "easeInOut" },
   },
  };

  const tubeVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [23, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: { duration: 0.45 * duration, ease: "easeOut" },
     opacity: { duration: 0.25 * duration },
    },
   },
  };

  const chestVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.4, 1, 1.4, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     delay: 0.3 * duration,
    },
   },
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
       d="M11 2v2"
       variants={earVariants}
       style={{ transformBox: "view-box", originX: "11px", originY: "3px" }}
      />
      <m.path
       d="M5 2v2"
       variants={earVariants}
       style={{ transformBox: "view-box", originX: "5px", originY: "3px" }}
      />
      <path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" />
      <m.path
       d="M8 15a6 6 0 0 0 12 0v-3"
       strokeDasharray="23"
       strokeDashoffset="0"
       variants={tubeVariants}
      />
      <m.circle
       cx="20"
       cy="10"
       r="2"
       variants={chestVariants}
       style={{ transformBox: "view-box", originX: "20px", originY: "10px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

StethoscopeIcon.displayName = "StethoscopeIcon";
export { StethoscopeIcon };
