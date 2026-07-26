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

export interface TvIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface TvIconProps extends Omit<
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

const TvIcon = forwardRef<TvIconHandle, TvIconProps>(
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
  const antennaControls = useAnimation();
  const screenControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   screenControls.start("on");
   antennaControls.start("on");
  }, [antennaControls, screenControls, reduced]);

  const stop = useCallback(() => {
   screenControls.start("rest");
   antennaControls.start("rest");
  }, [antennaControls, screenControls]);

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

  const screenVariants: Variants = {
   rest: { opacity: 1 },
   on: {
    opacity: [1, 0.32, 1, 0.44, 1, 0.76, 1],
    transition: {
     duration: 1.05 * duration,
     ease: "linear",
     times: [0, 0.08, 0.16, 0.28, 0.4, 0.58, 1],
    },
   },
  };

  const antennaVariants: Variants = {
   rest: { rotate: 0 },
   on: {
    rotate: [0, -7, 5.5, -3.4, 1.8, -0.8, 0],
    transition: {
     duration: 1.05 * duration,
     ease: "easeInOut",
     times: [0, 0.16, 0.34, 0.52, 0.7, 0.86, 1],
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
       d="m17 2-5 5-5-5"
       animate={antennaControls}
       initial="rest"
       variants={antennaVariants}
       style={{ transformBox: "fill-box", originX: "50%", originY: "100%" }}
      />
      <m.rect
       width="20"
       height="15"
       x="2"
       y="7"
       rx="2"
       animate={screenControls}
       initial="rest"
       variants={screenVariants}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

TvIcon.displayName = "TvIcon";
export { TvIcon };
