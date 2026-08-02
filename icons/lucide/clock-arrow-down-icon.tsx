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
export interface ClockArrowDownIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ClockArrowDownIconProps extends Omit<
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

const ClockArrowDownIcon = forwardRef<
 ClockArrowDownIconHandle,
 ClockArrowDownIconProps
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

  const dialVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.6 * duration, ease: [0.16, 1, 0.3, 1] },
   },
  };

  const handsVariants: Variants = {
   normal: { rotate: 0, opacity: 1 },
   animate: {
    rotate: [-45, 12, 0],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.55 * duration,
     delay: 0.35 * duration,
     times: [0, 0.6, 1],
     ease: [0.34, 1.4, 0.64, 1],
    },
   },
  };

  const arrowVariants: Variants = {
   normal: { y: 0, pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    y: [-4, 0],
    transition: {
     pathLength: {
      duration: 0.35 * duration,
      delay: 0.5 * duration,
      ease: [0.16, 1, 0.3, 1],
     },
     opacity: { duration: 0.2 * duration, delay: 0.5 * duration },
     y: {
      duration: 0.45 * duration,
      delay: 0.5 * duration,
      ease: [0.34, 1.4, 0.64, 1],
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
      <m.path
       d="M12.337 21.994a10 10 0 1 1 9.588-8.767"
       variants={dialVariants}
      />
      <m.path
       d="M12 6v6l2 1"
       variants={handsVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path d="m14 18 4 4 4-4" variants={arrowVariants} />
      <m.path d="M18 14v8" variants={arrowVariants} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ClockArrowDownIcon.displayName = "ClockArrowDownIcon";
export { ClockArrowDownIcon };
