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
export interface CalendarRangeIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CalendarRangeIconProps extends Omit<
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

const CalendarRangeIcon = forwardRef<
 CalendarRangeIconHandle,
 CalendarRangeIconProps
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

  const bodyVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.5 * duration, ease: [0.16, 1, 0.3, 1] },
   },
  };

  const hangerVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: (i: number) => ({
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.3 * duration,
     delay: i * 0.08 * duration,
     ease: [0.16, 1, 0.3, 1],
    },
   }),
  };

  const headerVariants: Variants = {
   normal: { scaleX: 1, opacity: 1 },
   animate: {
    scaleX: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.4 * duration,
     delay: 0.28 * duration,
     ease: [0.16, 1, 0.3, 1],
    },
   },
  };

  const markVariants: Variants = {
   normal: { scaleX: 1, opacity: 1 },
   animate: (i: number) => ({
    scaleX: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.35 * duration,
     delay: (0.4 + i * 0.1) * duration,
     ease: [0.16, 1, 0.3, 1],
    },
   }),
  };

  const dotVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: (i: number) => ({
    scale: [0, 1.25, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.35 * duration,
     delay: (0.45 + i * 0.1) * duration,
     times: [0, 0.6, 1],
     ease: [0.34, 1.4, 0.64, 1],
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
      <m.path d="M8 2v4" custom={0} variants={hangerVariants} />
      <m.path d="M16 2v4" custom={1} variants={hangerVariants} />
      <m.rect
       width="18"
       height="18"
       x="3"
       y="4"
       rx="2"
       variants={bodyVariants}
      />
      <m.path
       d="M3 10h18"
       variants={headerVariants}
       style={{ transformBox: "view-box", originX: "3px", originY: "10px" }}
      />
      <m.path
       d="M17 14h-6"
       custom={0}
       variants={markVariants}
       style={{ transformBox: "view-box", originX: "11px", originY: "14px" }}
      />
      <m.path
       d="M13 18H7"
       custom={1}
       variants={markVariants}
       style={{ transformBox: "view-box", originX: "7px", originY: "18px" }}
      />
      <m.path
       d="M7 14h.01"
       custom={0}
       variants={dotVariants}
       style={{ transformBox: "view-box", originX: "7px", originY: "14px" }}
      />
      <m.path
       d="M17 18h.01"
       custom={1}
       variants={dotVariants}
       style={{ transformBox: "view-box", originX: "17px", originY: "18px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CalendarRangeIcon.displayName = "CalendarRangeIcon";
export { CalendarRangeIcon };
