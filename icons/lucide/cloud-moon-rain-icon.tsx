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
export interface CloudMoonRainIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CloudMoonRainIconProps extends Omit<
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

const CloudMoonRainIcon = forwardRef<
 CloudMoonRainIconHandle,
 CloudMoonRainIconProps
>(
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

  const moonVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -12, 10, -4, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const dropVariants = (delay: number): Variants => ({
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [3, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.4 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
     opacity: {
      duration: 0.25 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
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
      <m.path
       d="M11 20v2"
       strokeDasharray="3"
       strokeDashoffset="0"
       variants={dropVariants(0.1)}
      />
      <m.path
       d="M18.376 14.512a6 6 0 0 0 3.461-4.127c.148-.625-.659-.97-1.248-.714a4 4 0 0 1-5.259-5.26c.255-.589-.09-1.395-.716-1.248a6 6 0 0 0-4.594 5.36"
       variants={moonVariants}
       style={{ transformBox: "view-box", originX: "16px", originY: "9px" }}
      />
      <path d="M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24" />
      <m.path
       d="M7 19v2"
       strokeDasharray="3"
       strokeDashoffset="0"
       variants={dropVariants(0)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CloudMoonRainIcon.displayName = "CloudMoonRainIcon";
export { CloudMoonRainIcon };
