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
export interface GoogleMapsIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GoogleMapsIconProps extends Omit<
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

const GoogleMapsIcon = forwardRef<GoogleMapsIconHandle, GoogleMapsIconProps>(
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
  const controls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () =>
     reduced ? controls.start("normal") : controls.start("animate"),
    stopAnimation: () => controls.start("normal"),
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) controls.start("animate");
    else onMouseEnter?.(e as any);
   },
   [controls, reduced, isAnimated, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const dotVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.5, 0.9, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const pinVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  const drawVariants = (
   length: number,
   delay: number,
   dur = 0.35,
  ): Variants => ({
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [length, 0],
    transition: {
     duration: dur * duration,
     ease: "easeInOut",
     delay: delay * duration,
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
     <m.svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={controls}
      initial="normal"
     >
      <m.circle
       cx="12"
       cy="9"
       r="2.5"
       variants={dotVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "9px" }}
      />
      <m.path
       d="M9 17L18 6"
       strokeDasharray="15"
       strokeDashoffset="0"
       variants={drawVariants(15, 0.05)}
      />
      <m.path
       d="M6 12L14 2.5"
       strokeDasharray="13"
       strokeDashoffset="0"
       variants={drawVariants(13, 0.15)}
      />
      <m.path
       d="M7 5L10 7.5"
       strokeDasharray="4"
       strokeDashoffset="0"
       variants={drawVariants(4, 0.25)}
      />
      <m.path
       d="M12.0097 22C11.656 22 11.4911 21.8487 11.3085 21.341C10.8283 19.6517 9.93051 18.1911 8.84193 16.8195C7.85602 15.5031 6.40188 14.0036 5.64625 12.2964C3.54607 7.65487 6.8014 1.99238 11.9927 2.00003C17.3276 1.98532 20.5359 7.85105 18.2565 12.5446C17.5862 13.7271 16.8028 14.8433 15.917 15.878C14.5359 17.5095 13.2946 19.2753 12.7057 21.3436C12.5703 21.7426 12.3955 22 12.0097 22Z"
       variants={pinVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

GoogleMapsIcon.displayName = "GoogleMapsIcon";
export { GoogleMapsIcon };
