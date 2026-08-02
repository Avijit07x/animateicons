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
export interface TimerResetIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface TimerResetIconProps extends Omit<
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

const TimerResetIcon = forwardRef<TimerResetIconHandle, TimerResetIconProps>(
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

  const buttonVariants: Variants = {
   normal: { scaleX: 1, opacity: 1 },
   animate: {
    scaleX: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.3 * duration, ease: [0.16, 1, 0.3, 1] },
   },
  };

  const resetVariants: Variants = {
   normal: { rotate: 0, pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    rotate: [-40, 0],
    transition: {
     pathLength: {
      duration: 0.55 * duration,
      delay: 0.15 * duration,
      ease: [0.16, 1, 0.3, 1],
     },
     opacity: { duration: 0.2 * duration, delay: 0.15 * duration },
     rotate: {
      duration: 0.6 * duration,
      delay: 0.15 * duration,
      ease: [0.34, 1.4, 0.64, 1],
     },
    },
   },
  };

  const handVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.3 * duration,
     delay: 0.6 * duration,
     ease: [0.16, 1, 0.3, 1],
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
       d="M10 2h4"
       variants={buttonVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "2px" }}
      />
      <m.path
       d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6"
       variants={resetVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M9 17H4v5"
       variants={resetVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path d="M12 14v-4" variants={handVariants} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

TimerResetIcon.displayName = "TimerResetIcon";
export { TimerResetIcon };
