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
export interface PackageCheckIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PackageCheckIconProps extends Omit<
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

const PackageCheckIcon = forwardRef<
 PackageCheckIconHandle,
 PackageCheckIconProps
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

  const boxVariants: Variants = {
   normal: { y: 0, rotate: 0 },
   animate: {
    y: [0, -1, 0.3, 0],
    rotate: [0, -6, 4, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const tickVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1, scale: 1 },
   animate: {
    strokeDashoffset: [9, 0],
    opacity: [0, 1],
    scale: [0.8, 1.12, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.45 * duration,
      ease: "easeOut",
      delay: 0.15 * duration,
     },
     opacity: { duration: 0.25 * duration, delay: 0.15 * duration },
     scale: {
      duration: 0.45 * duration,
      delay: 0.19 * duration,
      times: [0, 0.6, 1],
      ease: "easeInOut",
     },
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
      <m.g
       variants={boxVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M12 22V12" />
       <path d="M21 11.127V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.729l7 4a2 2 0 0 0 2 .001l1.32-.753" />
       <path d="M3.29 7 12 12l8.71-5" />
       <path d="m7.5 4.27 8.997 5.148" />
      </m.g>
      <m.path
       d="m16 17 2 2 4-4"
       strokeDasharray="9"
       strokeDashoffset="0"
       variants={tickVariants}
       style={{ transformBox: "view-box", originX: "19px", originY: "17px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PackageCheckIcon.displayName = "PackageCheckIcon";
export { PackageCheckIcon };
