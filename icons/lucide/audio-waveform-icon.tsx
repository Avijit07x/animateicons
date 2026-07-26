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

export interface AudioWaveformIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface AudioWaveformIconProps extends Omit<
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

const WAVE_D =
 "M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2";

const HEAD = 0.16;

const AudioWaveformIcon = forwardRef<
 AudioWaveformIconHandle,
 AudioWaveformIconProps
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

  const start = useCallback(() => {
   if (reduced) return;
   controls.start("sweep");
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

  const trackVariants: Variants = {
   rest: {
    opacity: 1,
    transition: { duration: 0.26 * duration, ease: "easeOut" },
   },
   sweep: {
    opacity: 0.3,
    transition: { duration: 0.18 * duration, ease: "easeOut" },
   },
  };

  const playheadVariants: Variants = {
   rest: {
    pathLength: 1,
    pathOffset: 0,
    transition: { duration: 0.28 * duration, ease: "easeOut" },
   },
   sweep: {
    pathLength: [HEAD, HEAD],
    pathOffset: [-HEAD, 1],
    transition: {
     duration: 1.25 * duration,
     ease: "linear",
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
       d={WAVE_D}
       animate={controls}
       initial="rest"
       variants={trackVariants}
      />
      <m.path
       d={WAVE_D}
       animate={controls}
       initial="rest"
       variants={playheadVariants}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

AudioWaveformIcon.displayName = "AudioWaveformIcon";
export { AudioWaveformIcon };
