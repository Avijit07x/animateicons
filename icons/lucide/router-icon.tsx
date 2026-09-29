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
export interface RouterIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface RouterIconProps extends Omit<
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

const RouterIcon = forwardRef<RouterIconHandle, RouterIconProps>(
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

  const waveVariants = (peak: number, delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, peak, 0.96, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     delay: delay * duration,
     times: [0, 0.35, 0.7, 1],
    },
   },
  });

  const blinkVariants = (delay: number): Variants => ({
   normal: { opacity: 1, scale: 1 },
   animate: {
    opacity: [1, 0.15, 1],
    scale: [1, 0.6, 1],
    transition: {
     duration: 0.4 * duration,
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
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M15 10v4" />
      <m.path
       d="M17.84 7.17a4 4 0 0 0-5.66 0"
       variants={waveVariants(1.25, 0)}
       style={{ transformBox: "view-box", originX: "15px", originY: "10px" }}
      />
      <m.path
       d="M20.66 4.34a8 8 0 0 0-11.31 0"
       variants={waveVariants(1.12, 0.12)}
       style={{ transformBox: "view-box", originX: "15px", originY: "10px" }}
      />
      <m.path
       d="M6.01 18H6"
       variants={blinkVariants(0.1)}
       style={{ transformBox: "view-box", originX: "6px", originY: "18px" }}
      />
      <m.path
       d="M10.01 18H10"
       variants={blinkVariants(0.25)}
       style={{ transformBox: "view-box", originX: "10px", originY: "18px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

RouterIcon.displayName = "RouterIcon";
export { RouterIcon };
