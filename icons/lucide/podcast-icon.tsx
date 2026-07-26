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

export interface PodcastIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PodcastIconProps extends Omit<
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

const PodcastIcon = forwardRef<PodcastIconHandle, PodcastIconProps>(
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
  const waveControls = useAnimation();
  const dotControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   waveControls.start("live");
   dotControls.start("live");
  }, [waveControls, dotControls, reduced]);

  const stop = useCallback(() => {
   waveControls.start("rest");
   dotControls.start("rest");
  }, [waveControls, dotControls]);

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

  const waveVariants = (i: number): Variants => ({
   rest: { opacity: 1, scale: 1 },
   live: {
    opacity: [0.25, 1, 0.25],
    scale: [0.94, 1.05, 0.94],
    transition: {
     duration: 1.2 * duration,
     ease: "easeInOut",
     repeat: Infinity,
     delay: i * 0.16 * duration,
    },
   },
  });

  const dotVariants: Variants = {
   rest: { scale: 1 },
   live: {
    scale: [1, 1.35, 1],
    transition: {
     duration: 1.2 * duration,
     ease: "easeInOut",
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
      <path
       d="M13 17a1 1 0 1 0-2 0l.5 4.5a0.5 0.5 0 0 0 1 0z"
       fill="currentColor"
      />
      <m.path
       d="M16.85 18.58a9 9 0 1 0-9.7 0"
       animate={waveControls}
       initial="rest"
       variants={waveVariants(1)}
       style={{ transformBox: "view-box", originX: "12px", originY: "11px" }}
      />
      <m.path
       d="M8 14a5 5 0 1 1 8 0"
       animate={waveControls}
       initial="rest"
       variants={waveVariants(0)}
       style={{ transformBox: "view-box", originX: "12px", originY: "11px" }}
      />
      <m.circle
       cx="12"
       cy="11"
       r="1"
       fill="currentColor"
       animate={dotControls}
       initial="rest"
       variants={dotVariants}
       style={{ transformBox: "fill-box" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PodcastIcon.displayName = "PodcastIcon";
export { PodcastIcon };
