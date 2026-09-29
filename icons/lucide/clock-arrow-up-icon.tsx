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
export interface ClockArrowUpIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ClockArrowUpIconProps extends Omit<
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

const ClockArrowUpIcon = forwardRef<
 ClockArrowUpIconHandle,
 ClockArrowUpIconProps
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

  const arrowVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -1.5, 0.44999999999999996, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
     delay: 0.1 * duration,
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
       d="M12 6V12"
       variants={minuteVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <path d="M12 12l1.56.78" />
      <path d="M13.227 21.925a10 10 0 1 1 8.767-9.588" />
      <m.g variants={arrowVariants}>
       <path d="m14 18 4-4 4 4" />
       <path d="M18 22v-8" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ClockArrowUpIcon.displayName = "ClockArrowUpIcon";
export { ClockArrowUpIcon };
