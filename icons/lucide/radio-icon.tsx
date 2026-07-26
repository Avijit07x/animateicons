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

export interface RadioIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface RadioIconProps extends Omit<
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

const RadioIcon = forwardRef<RadioIconHandle, RadioIconProps>(
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
   waveControls.start("tune");
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
   tune: {
    opacity: [0.2, 1, 0.2],
    scale: [0.92, 1.06, 0.92],
    transition: {
     duration: 1.2 * duration,
     ease: "easeInOut",
     repeat: Infinity,
     delay: i * 0.16 * duration,
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
       d="M16.247 7.761a6 6 0 0 1 0 8.478"
       animate={waveControls}
       initial="rest"
       variants={waveVariants(0)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M19.075 4.933a10 10 0 0 1 0 14.134"
       animate={waveControls}
       initial="rest"
       variants={waveVariants(1)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M4.925 19.067a10 10 0 0 1 0-14.134"
       animate={waveControls}
       initial="rest"
       variants={waveVariants(1)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M7.753 16.239a6 6 0 0 1 0-8.478"
       animate={waveControls}
       initial="rest"
       variants={waveVariants(0)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <circle cx="12" cy="12" r="2" />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

RadioIcon.displayName = "RadioIcon";
export { RadioIcon };
