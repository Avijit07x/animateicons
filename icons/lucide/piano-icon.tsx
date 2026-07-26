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

export interface PianoIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PianoIconProps extends Omit<
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

const PianoIcon = forwardRef<PianoIconHandle, PianoIconProps>(
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
  const keyControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   keyControls.start("play");
  }, [keyControls, reduced]);

  const stop = useCallback(() => {
   keyControls.start("rest");
  }, [keyControls]);

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

  const keyVariants = (i: number): Variants => ({
   rest: { scaleY: 1 },
   play: {
    scaleY: [1, 1.22, 1],
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
      <path d="M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8" />
      <path d="M2 14h20" />
      <m.path
       d="M6 14v4"
       animate={keyControls}
       initial="rest"
       variants={keyVariants(0)}
       style={{ transformBox: "fill-box", originX: "50%", originY: "0%" }}
      />
      <m.path
       d="M10 14v4"
       animate={keyControls}
       initial="rest"
       variants={keyVariants(1)}
       style={{ transformBox: "fill-box", originX: "50%", originY: "0%" }}
      />
      <m.path
       d="M14 14v4"
       animate={keyControls}
       initial="rest"
       variants={keyVariants(2)}
       style={{ transformBox: "fill-box", originX: "50%", originY: "0%" }}
      />
      <m.path
       d="M18 14v4"
       animate={keyControls}
       initial="rest"
       variants={keyVariants(3)}
       style={{ transformBox: "fill-box", originX: "50%", originY: "0%" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PianoIcon.displayName = "PianoIcon";
export { PianoIcon };
