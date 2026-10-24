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
export interface ClockCheckIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ClockCheckIconProps extends Omit<
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

const ClockCheckIcon = forwardRef<ClockCheckIconHandle, ClockCheckIconProps>(
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

  const minuteVariants: Variants = {
   normal: { rotate: 0, transition: { duration: 0 } },
   animate: {
    rotate: [0, 360],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const tickVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1, scale: 1 },
   animate: {
    strokeDashoffset: [9, 0],
    opacity: [0, 1],
    scale: [0.8, 1.12, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.45 * duration,
      ease: "easeOut",
      delay: 0.15 * duration,
     },
     opacity: { duration: 0.25 * duration, delay: 0.15 * duration },
     scale: {
      duration: 0.45 * duration,
      delay: 0.19 * duration,
      times: [0, 0.6, 1],
      ease: "easeInOut",
     },
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
      <path d="M21.95 13a10 10 0 1 0-8.685 8.92" />
      <m.path
       d="M12 6V12"
       variants={minuteVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <path d="M12 12l4 2" />
      <m.path
       d="m16 19 2 2 4-4"
       strokeDasharray="9"
       strokeDashoffset="0"
       variants={tickVariants}
       style={{ transformBox: "view-box", originX: "19px", originY: "19px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ClockCheckIcon.displayName = "ClockCheckIcon";
export { ClockCheckIcon };
