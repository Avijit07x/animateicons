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

export interface RepeatIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface RepeatIconProps extends Omit<
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

const TOP_D = "M3 11v-1a4 4 0 0 1 4-4h14";
const BOTTOM_D = "M21 13v1a4 4 0 0 1-4 4H3";
const DASH = 0.34;

const RepeatIcon = forwardRef<RepeatIconHandle, RepeatIconProps>(
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

  const start = useCallback(() => {
   if (reduced) return;
   controls.start("cycle");
  }, [controls, reduced]);

  const stop = useCallback(() => {
   controls.start("rest");
  }, [controls]);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: start,
    stopAnimation: stop,
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) start();
    else onMouseEnter?.(e as any);
   },
   [isAnimated, reduced, start, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) stop();
    else onMouseLeave?.(e);
   },
   [stop, onMouseLeave],
  );

  const cycle = 1.8 * duration;

  const baseVariants: Variants = {
   rest: {
    opacity: 1,
    transition: { duration: 0.3 * duration, ease: "easeOut" },
   },
   cycle: {
    opacity: 0.3,
    transition: { duration: 0.2 * duration, ease: "easeOut" },
   },
  };

  const topPulseVariants: Variants = {
   rest: { opacity: 0, pathLength: 1, pathOffset: 0 },
   cycle: {
    opacity: [0, 1, 1, 0, 0],
    pathLength: [DASH, DASH, DASH, DASH, DASH],
    pathOffset: [0, 0, 1, 1, 1],
    transition: {
     duration: cycle,
     ease: "linear",
     times: [0, 0.04, 0.46, 0.5, 1],
     repeat: Infinity,
    },
   },
  };

  const bottomPulseVariants: Variants = {
   rest: { opacity: 0, pathLength: 1, pathOffset: 0 },
   cycle: {
    opacity: [0, 0, 1, 1, 0],
    pathLength: [DASH, DASH, DASH, DASH, DASH],
    pathOffset: [0, 0, 0, 1, 1],
    transition: {
     duration: cycle,
     ease: "linear",
     times: [0, 0.5, 0.54, 0.96, 1],
     repeat: Infinity,
    },
   },
  };

  const topHeadVariants: Variants = {
   rest: { scale: 1 },
   cycle: {
    scale: [1, 1, 1.3, 1, 1],
    transition: {
     duration: cycle,
     ease: "easeInOut",
     times: [0, 0.4, 0.48, 0.58, 1],
     repeat: Infinity,
    },
   },
  };

  const bottomHeadVariants: Variants = {
   rest: { scale: 1 },
   cycle: {
    scale: [1, 1, 1.3, 1],
    transition: {
     duration: cycle,
     ease: "easeInOut",
     times: [0, 0.9, 0.98, 1],
     repeat: Infinity,
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
     <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
     >
      <m.path
       d={TOP_D}
       animate={controls}
       initial="rest"
       variants={baseVariants}
      />
      <m.path
       d={BOTTOM_D}
       animate={controls}
       initial="rest"
       variants={baseVariants}
      />
      <m.path
       d={TOP_D}
       animate={controls}
       initial="rest"
       variants={topPulseVariants}
      />
      <m.path
       d={BOTTOM_D}
       animate={controls}
       initial="rest"
       variants={bottomPulseVariants}
      />
      <m.path
       d="m17 2 4 4-4 4"
       animate={controls}
       initial="rest"
       variants={topHeadVariants}
       style={{ transformBox: "fill-box" }}
      />
      <m.path
       d="m7 22-4-4 4-4"
       animate={controls}
       initial="rest"
       variants={bottomHeadVariants}
       style={{ transformBox: "fill-box" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

RepeatIcon.displayName = "RepeatIcon";
export { RepeatIcon };
