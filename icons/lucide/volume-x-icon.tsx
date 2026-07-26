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

export interface VolumeXIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface VolumeXIconProps extends Omit<
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

const VolumeXIcon = forwardRef<VolumeXIconHandle, VolumeXIconProps>(
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
  const crossControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   crossControls.start("mute");
  }, [crossControls, reduced]);

  const stop = useCallback(() => {
   crossControls.start("rest");
  }, [crossControls]);

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

  const crossVariants = (i: number): Variants => ({
   rest: { pathLength: 1, opacity: 1, scale: 1 },
   mute: {
    pathLength: [0, 1],
    opacity: [0, 1],
    scale: [0.7, 1.12, 1],
    transition: {
     duration: 0.8 * duration,
     ease: [0.34, 1.4, 0.64, 1],
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
      <m.line
       x1="22"
       x2="16"
       y1="9"
       y2="15"
       animate={crossControls}
       initial="rest"
       variants={crossVariants(0)}
       style={{ transformBox: "fill-box", originX: "50%", originY: "50%" }}
      />
      <m.line
       x1="16"
       x2="22"
       y1="9"
       y2="15"
       animate={crossControls}
       initial="rest"
       variants={crossVariants(1)}
       style={{ transformBox: "fill-box", originX: "50%", originY: "50%" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

VolumeXIcon.displayName = "VolumeXIcon";
export { VolumeXIcon };
