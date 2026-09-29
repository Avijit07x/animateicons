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
export interface MarsIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MarsIconProps extends Omit<
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

const MarsIcon = forwardRef<MarsIconHandle, MarsIconProps>(
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

  const arrowVariants: Variants = {
   normal: { scale: 1, opacity: 1, rotate: 0 },
   animate: {
    scale: [0, 1.12, 1],
    opacity: [0, 1],
    rotate: [-12, 2, 0],
    transition: {
     scale: { duration: 0.45 * duration, ease: "easeInOut" },
     opacity: { duration: 0.25 * duration },
     rotate: { duration: 0.45 * duration, ease: "easeInOut" },
    },
   },
  };

  const lineVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [10, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.4 * duration,
      ease: "easeOut",
      delay: 0.12 * duration,
     },
     opacity: { duration: 0.25 * duration, delay: 0.12 * duration },
    },
   },
  };

  const circleVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1, scale: 1 },
   animate: {
    strokeDashoffset: [38, 0],
    opacity: [0, 1],
    scale: [0.88, 1.04, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.55 * duration,
      ease: "easeOut",
      delay: 0.3 * duration,
     },
     opacity: { duration: 0.25 * duration, delay: 0.3 * duration },
     scale: {
      duration: 0.55 * duration,
      ease: "easeInOut",
      delay: 0.3 * duration,
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
      <m.path
       d="M16 3h5v5"
       variants={arrowVariants}
       style={{ transformBox: "view-box", originX: "18.5px", originY: "5.5px" }}
      />
      <m.path
       d="m21 3-6.75 6.75"
       strokeDasharray="10"
       strokeDashoffset="0"
       variants={lineVariants}
      />
      <m.circle
       cx="10"
       cy="14"
       r="6"
       strokeDasharray="38"
       strokeDashoffset="0"
       variants={circleVariants}
       style={{ transformBox: "view-box", originX: "10px", originY: "14px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MarsIcon.displayName = "MarsIcon";
export { MarsIcon };
