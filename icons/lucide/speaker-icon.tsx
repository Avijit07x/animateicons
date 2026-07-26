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

export interface SpeakerIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SpeakerIconProps extends Omit<
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

const SpeakerIcon = forwardRef<SpeakerIconHandle, SpeakerIconProps>(
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
  const wooferControls = useAnimation();
  const tweeterControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   wooferControls.start("boom");
   tweeterControls.start("boom");
  }, [wooferControls, tweeterControls, reduced]);

  const stop = useCallback(() => {
   wooferControls.start("rest");
   tweeterControls.start("rest");
  }, [wooferControls, tweeterControls]);

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

  const wooferVariants: Variants = {
   rest: { scale: 1 },
   boom: {
    scale: [1, 1.14, 0.96, 1.06, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.24, 0.5, 0.76, 1],
     repeat: Infinity,
    },
   },
  };

  const tweeterVariants: Variants = {
   rest: { scale: 1 },
   boom: {
    scale: [1, 1.5, 1],
    transition: {
     duration: 0.35 * duration,
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
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <m.path
       d="M12 6h.01"
       animate={tweeterControls}
       initial="rest"
       variants={tweeterVariants}
       style={{ transformBox: "fill-box" }}
      />
      <m.circle
       cx="12"
       cy="14"
       r="4"
       animate={wooferControls}
       initial="rest"
       variants={wooferVariants}
       style={{ transformBox: "fill-box" }}
      />
      <m.path
       d="M12 14h.01"
       animate={wooferControls}
       initial="rest"
       variants={wooferVariants}
       style={{ transformBox: "fill-box" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SpeakerIcon.displayName = "SpeakerIcon";
export { SpeakerIcon };
