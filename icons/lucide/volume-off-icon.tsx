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

export interface VolumeOffIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface VolumeOffIconProps extends Omit<
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

const VolumeOffIcon = forwardRef<VolumeOffIconHandle, VolumeOffIconProps>(
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
  const slashControls = useAnimation();
  const waveControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   slashControls.start("cut");
   waveControls.start("cut");
  }, [slashControls, waveControls, reduced]);

  const stop = useCallback(() => {
   slashControls.start("rest");
   waveControls.start("rest");
  }, [slashControls, waveControls]);

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

  const slashVariants: Variants = {
   rest: { pathLength: 1, opacity: 1 },
   cut: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.9 * duration, ease: [0.16, 1, 0.3, 1] },
   },
  };

  const waveVariants = (i: number): Variants => ({
   rest: { opacity: 1 },
   cut: {
    opacity: [1, 0.25, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: i * 0.08 * duration,
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
       d="M16 9a5 5 0 0 1 .95 2.293"
       animate={waveControls}
       initial="rest"
       variants={waveVariants(0)}
       style={{ transformBox: "fill-box", originX: "0%", originY: "50%" }}
      />
      <m.path
       d="M19.364 5.636a9 9 0 0 1 1.889 9.96"
       animate={waveControls}
       initial="rest"
       variants={waveVariants(1)}
       style={{ transformBox: "fill-box", originX: "0%", originY: "50%" }}
      />
      <m.path
       d="m2 2 20 20"
       animate={slashControls}
       initial="rest"
       variants={slashVariants}
       style={{ transformBox: "fill-box", originX: "0%", originY: "0%" }}
      />
      <path d="m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11" />
      <path d="M9.828 4.172A.686.686 0 0 1 11 4.657v.686" />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

VolumeOffIcon.displayName = "VolumeOffIcon";
export { VolumeOffIcon };
