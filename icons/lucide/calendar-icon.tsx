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

export interface CalendarIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CalendarIconProps extends Omit<
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

const CalendarIcon = forwardRef<CalendarIconHandle, CalendarIconProps>(
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
  const ringControls = useAnimation();
  const pageControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   ringControls.start("flip");
   pageControls.start("flip");
  }, [ringControls, pageControls, reduced]);

  const stop = useCallback(() => {
   ringControls.start("rest");
   pageControls.start("rest");
  }, [ringControls, pageControls]);

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

  const ringVariants: Variants = {
   rest: { y: 0 },
   flip: {
    y: [0, -1.5, 0],
    transition: { duration: 0.8 * duration, ease: [0.34, 1.4, 0.64, 1] },
   },
  };

  const pageVariants: Variants = {
   rest: { scaleY: 1 },
   flip: {
    scaleY: [1, 0.88, 1.03, 1],
    transition: {
     duration: 0.8 * duration,
     ease: [0.34, 1.4, 0.64, 1],
     times: [0, 0.35, 0.7, 1],
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
       d="M8 2v4"
       animate={ringControls}
       initial="rest"
       variants={ringVariants}
       style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
      />
      <m.path
       d="M16 2v4"
       animate={ringControls}
       initial="rest"
       variants={ringVariants}
       style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
      />
      <m.rect
       width="18"
       height="18"
       x="3"
       y="4"
       rx="2"
       animate={pageControls}
       initial="rest"
       variants={pageVariants}
       style={{ transformBox: "fill-box", transformOrigin: "top center" }}
      />
      <path d="M3 10h18" />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CalendarIcon.displayName = "CalendarIcon";
export { CalendarIcon };
