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
export interface CheckListIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CheckListIconProps extends Omit<
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

const CheckListIcon = forwardRef<CheckListIconHandle, CheckListIconProps>(
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

  const rowVariants = (delay: number): Variants => ({
   normal: { scaleX: 1 },
   animate: {
    scaleX: [0.3, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeOut",
     delay: delay * duration,
    },
   },
  });

  const tickVariants = (delay: number): Variants => ({
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [9, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.35 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
     opacity: { duration: 0.05 * duration, delay: delay * duration },
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
       d="M11 6L21 6"
       variants={rowVariants(0)}
       style={{ transformBox: "view-box", originX: "11px", originY: "6px" }}
      />
      <m.path
       d="M11 12L21 12"
       variants={rowVariants(0.15)}
       style={{ transformBox: "view-box", originX: "11px", originY: "12px" }}
      />
      <m.path
       d="M11 18L21 18"
       variants={rowVariants(0.3)}
       style={{ transformBox: "view-box", originX: "11px", originY: "18px" }}
      />
      <m.path
       d="M3 7.39286C3 7.39286 4 8.04466 4.5 9C4.5 9 6 5.25 8 4"
       strokeDasharray="9"
       strokeDashoffset="0"
       variants={tickVariants(0.05)}
      />
      <m.path
       d="M3 18.3929C3 18.3929 4 19.0447 4.5 20C4.5 20 6 16.25 8 15"
       strokeDasharray="9"
       strokeDashoffset="0"
       variants={tickVariants(0.35)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CheckListIcon.displayName = "CheckListIcon";
export { CheckListIcon };
