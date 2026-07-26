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

export interface Volume2IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Volume2IconProps extends Omit<
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

const Volume2Icon = forwardRef<Volume2IconHandle, Volume2IconProps>(
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
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   waveControls.start("play");
  }, [waveControls, reduced]);

  const stop = useCallback(() => {
   waveControls.start("rest");
  }, [waveControls]);

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
   play: {
    opacity: [0.2, 1, 0.2],
    scale: [0.85, 1.1, 0.85],
    transition: {
     duration: 1 * duration,
     ease: "easeInOut",
     repeat: Infinity,
     delay: i * 0.12 * duration,
    },
   },
  });

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
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
      <m.path
       d="M16 9a5 5 0 0 1 0 6"
       animate={waveControls}
       initial="rest"
       variants={waveVariants(0)}
       style={{ transformBox: "fill-box", transformOrigin: "left center" }}
      />
      <m.path
       d="M19.364 18.364a9 9 0 0 0 0-12.728"
       animate={waveControls}
       initial="rest"
       variants={waveVariants(1)}
       style={{ transformBox: "fill-box", transformOrigin: "left center" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Volume2Icon.displayName = "Volume2Icon";
export { Volume2Icon };
