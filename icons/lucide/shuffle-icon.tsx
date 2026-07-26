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

export interface ShuffleIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ShuffleIconProps extends Omit<
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

const ShuffleIcon = forwardRef<ShuffleIconHandle, ShuffleIconProps>(
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
  const tipControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   tipControls.start("cross");
  }, [tipControls, reduced]);

  const stop = useCallback(() => {
   tipControls.start("rest");
  }, [tipControls]);

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

  const tipVariants = (i: number): Variants => ({
   rest: { x: 0 },
   cross: {
    x: [0, 1.8, 0],
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
      <m.path
       d="m18 14 4 4-4 4"
       animate={tipControls}
       initial="rest"
       variants={tipVariants(0)}
       style={{ transformBox: "fill-box" }}
      />
      <m.path
       d="m18 2 4 4-4 4"
       animate={tipControls}
       initial="rest"
       variants={tipVariants(1)}
       style={{ transformBox: "fill-box" }}
      />
      <path d="M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" />
      <path d="M2 6h1.972a4 4 0 0 1 3.6 2.2" />
      <path d="M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ShuffleIcon.displayName = "ShuffleIcon";
export { ShuffleIcon };
