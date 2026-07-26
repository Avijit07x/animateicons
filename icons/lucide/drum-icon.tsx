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

export interface DrumIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface DrumIconProps extends Omit<
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

const DrumIcon = forwardRef<DrumIconHandle, DrumIconProps>(
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
  const stickControls = useAnimation();
  const skinControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   stickControls.start("hit");
   skinControls.start("hit");
  }, [stickControls, skinControls, reduced]);

  const stop = useCallback(() => {
   stickControls.start("rest");
   skinControls.start("rest");
  }, [stickControls, skinControls]);

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

  const stickVariants = (i: number): Variants => ({
   rest: { rotate: 0 },
   hit: {
    rotate: i === 0 ? [0, 14, -3, 0] : [0, -14, 3, 0],
    transition: {
     duration: 0.8 * duration,
     ease: [0.34, 1.4, 0.64, 1],
     times: [0, 0.35, 0.7, 1],
     delay: i * 0.12 * duration,
    },
   },
  });

  const skinVariants: Variants = {
   rest: { scaleY: 1 },
   hit: {
    scaleY: [1, 0.88, 1.05, 1],
    transition: {
     duration: 0.8 * duration,
     ease: [0.34, 1.4, 0.64, 1],
     times: [0, 0.38, 0.72, 1],
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
      <m.path
       d="m2 2 8 8"
       animate={stickControls}
       initial="rest"
       variants={stickVariants(0)}
       style={{ transformBox: "view-box", originX: "2px", originY: "2px" }}
      />
      <m.path
       d="m22 2-8 8"
       animate={stickControls}
       initial="rest"
       variants={stickVariants(1)}
       style={{ transformBox: "view-box", originX: "22px", originY: "2px" }}
      />
      <m.ellipse
       cx="12"
       cy="9"
       rx="10"
       ry="5"
       animate={skinControls}
       initial="rest"
       variants={skinVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "9px" }}
      />
      <path d="M7 13.4v7.9" />
      <path d="M12 14v8" />
      <path d="M17 13.4v7.9" />
      <path d="M2 9v8a10 5 0 0 0 20 0V9" />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

DrumIcon.displayName = "DrumIcon";
export { DrumIcon };
