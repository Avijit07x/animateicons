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

export interface ImageIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ImageIconProps extends Omit<
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

const ImageIcon = forwardRef<ImageIconHandle, ImageIconProps>(
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
  const peakControls = useAnimation();
  const sunControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   peakControls.start("draw");
   sunControls.start("draw");
  }, [peakControls, sunControls, reduced]);

  const stop = useCallback(() => {
   peakControls.start("rest");
   sunControls.start("rest");
  }, [peakControls, sunControls]);

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

  const peakVariants: Variants = {
   rest: { pathLength: 1, opacity: 1 },
   draw: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.9 * duration, ease: [0.16, 1, 0.3, 1] },
   },
  };

  const sunVariants: Variants = {
   rest: { scale: 1, opacity: 1 },
   draw: {
    scale: [0, 1.25, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.8 * duration,
     ease: [0.34, 1.4, 0.64, 1],
     delay: 0.3 * duration,
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
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <m.circle
       cx="9"
       cy="9"
       r="2"
       animate={sunControls}
       initial="rest"
       variants={sunVariants}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <m.path
       d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"
       animate={peakControls}
       initial="rest"
       variants={peakVariants}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ImageIcon.displayName = "ImageIcon";
export { ImageIcon };
