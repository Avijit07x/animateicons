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

export interface CarIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CarIconProps extends Omit<
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

const CarIcon = forwardRef<CarIconHandle, CarIconProps>(
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
  const driveControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   driveControls.start("drive");
  }, [driveControls, reduced]);

  const stop = useCallback(() => {
   driveControls.start("rest");
  }, [driveControls]);

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

  const cycle = 1.4 * duration;
  const roadTimes = [0, 0.11, 0.22, 0.33, 0.5, 0.62, 0.78, 0.9, 1];
  const pitchTimes = [0, 0.14, 0.27, 0.4, 0.54, 0.67, 0.81, 0.92, 1];
  const tyreBob = [0, -0.16, 0.05, 0, -0.12, 0.03, -0.07, 0.02, 0];
  const chassisPivot = {
   transformBox: "view-box",
   originX: "12px",
   originY: "19px",
  } as const;

  const bodyVariants: Variants = {
   rest: { y: 0, rotate: 0 },
   drive: {
    y: [0, -0.28, 0.09, -0.05, -0.21, 0.06, -0.12, 0.03, 0],
    rotate: [0, -1.05, 0.68, -0.2, -0.76, 0.44, -0.36, 0.12, 0],
    transition: {
     y: {
      duration: cycle,
      ease: "easeInOut",
      times: roadTimes,
      repeat: Infinity,
      delay: 0.08 * duration,
     },
     rotate: {
      duration: cycle,
      ease: "easeInOut",
      times: pitchTimes,
      repeat: Infinity,
      delay: 0.08 * duration,
     },
    },
   },
  };

  const frontWheelVariants: Variants = {
   rest: { y: 0 },
   drive: {
    y: tyreBob,
    transition: {
     duration: cycle,
     ease: "easeInOut",
     times: roadTimes,
     repeat: Infinity,
    },
   },
  };

  const rearWheelVariants: Variants = {
   rest: { y: 0 },
   drive: {
    y: tyreBob,
    transition: {
     duration: cycle,
     ease: "easeInOut",
     times: roadTimes,
     repeat: Infinity,
     delay: 0.12 * duration,
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
       d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"
       animate={driveControls}
       initial="rest"
       variants={bodyVariants}
       style={chassisPivot}
      />
      <m.circle
       cx="7"
       cy="17"
       r="2"
       animate={driveControls}
       initial="rest"
       variants={rearWheelVariants}
      />
      <m.path
       d="M9 17h6"
       animate={driveControls}
       initial="rest"
       variants={bodyVariants}
       style={chassisPivot}
      />
      <m.circle
       cx="17"
       cy="17"
       r="2"
       animate={driveControls}
       initial="rest"
       variants={frontWheelVariants}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CarIcon.displayName = "CarIcon";
export { CarIcon };
