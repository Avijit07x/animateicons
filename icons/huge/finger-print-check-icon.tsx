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
export interface FingerPrintCheckIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FingerPrintCheckIconProps extends Omit<
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

const FingerPrintCheckIcon = forwardRef<
 FingerPrintCheckIconHandle,
 FingerPrintCheckIconProps
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

  const printVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     pathLength: { duration: 0.8 * duration, ease: "easeInOut" },
     opacity: { duration: 0.05 * duration },
    },
   },
  };

  const ringVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.25, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
    },
   },
  };

  const tickVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [5, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.45 * duration,
      ease: "easeOut",
      delay: 0.15 * duration,
     },
     opacity: { duration: 0.1 * duration, delay: 0.15 * duration },
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
       d="M5.92683 20.5968C3.85533 19.1894 2.5 16.8511 2.5 14.2044V9.75383C2.5 8.56968 2.7713 7.44725 3.25666 6.4423M9.35367 21.914C10.255 22.0396 11.145 22.007 11.9952 21.8397M17.7224 6.4159C15.6293 2.12426 9.8958 0.664733 5.92683 3.36135M18.4919 10.3293V11.4954M10.4959 5.99807C12.7039 5.99807 14.4939 7.87756 14.4939 10.196M6.88271 8.39691C6.63601 8.9422 6.49797 9.55219 6.49797 10.196V13.7943C6.49797 16.1128 8.28793 17.9923 10.4959 17.9923C10.6652 17.9923 10.832 17.9813 10.9957 17.9598M10.4959 10.4959V13.4945"
       variants={printVariants}
      />
      <m.path
       d="M16.1702 18.447C16.4706 18.5912 16.8432 18.9639 17.0235 19.2643C17.0836 19.685 17.3841 18.0624 18.8505 17.1008"
       strokeDasharray="5"
       strokeDashoffset="0"
       variants={tickVariants}
      />
      <m.path
       d="M21.5 18C21.5 20.2091 19.7091 22 17.5 22C15.2909 22 13.5 20.2091 13.5 18C13.5 15.7909 15.2909 14 17.5 14C19.7091 14 21.5 15.7909 21.5 18Z"
       variants={ringVariants}
       style={{ transformBox: "view-box", originX: "17.5px", originY: "18px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FingerPrintCheckIcon.displayName = "FingerPrintCheckIcon";
export { FingerPrintCheckIcon };
