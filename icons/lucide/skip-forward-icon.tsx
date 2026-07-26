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

export interface SkipForwardIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SkipForwardIconProps extends Omit<
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

const SkipForwardIcon = forwardRef<SkipForwardIconHandle, SkipForwardIconProps>(
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
  const headControls = useAnimation();
  const barControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   headControls.start("skip");
   barControls.start("skip");
  }, [headControls, barControls, reduced]);

  const stop = useCallback(() => {
   headControls.start("rest");
   barControls.start("rest");
  }, [headControls, barControls]);

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

  const headVariants: Variants = {
   rest: { x: 0 },
   skip: {
    x: [0, 2.2, -0.6, 0],
    transition: {
     duration: 1 * duration,
     ease: "easeInOut",
     times: [0, 0.42, 0.74, 1],
    },
   },
  };

  const barVariants: Variants = {
   rest: { x: 0, scaleY: 1 },
   skip: {
    x: [0, 0.7, -0.2, 0],
    scaleY: [1, 1.1, 0.98, 1],
    transition: {
     duration: 1 * duration,
     ease: "easeInOut",
     times: [0, 0.42, 0.74, 1],
     delay: 0.08 * duration,
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
       d="M21 4v16"
       animate={barControls}
       initial="rest"
       variants={barVariants}
       style={{ transformBox: "fill-box", originX: "50%", originY: "50%" }}
      />
      <m.path
       d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z"
       animate={headControls}
       initial="rest"
       variants={headVariants}
       style={{ transformBox: "fill-box" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SkipForwardIcon.displayName = "SkipForwardIcon";
export { SkipForwardIcon };
