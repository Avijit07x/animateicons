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
export interface SiriIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SiriIconProps extends Omit<
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

const SiriIcon = forwardRef<SiriIconHandle, SiriIconProps>(
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

  const ringVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  const waveVariants = (delay: number): Variants => ({
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 1.15, 0.88, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
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
       cy="12"
       r="10"
       variants={ringVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M3 7.59199C9 9.31999 10.5 5 19 5"
       variants={waveVariants(0.0)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M2 12C11 12 13 5.49859 18 5"
       variants={waveVariants(0.06)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M18 19.88C12.7189 21.1446 6.44444 12 2 12"
       variants={waveVariants(0.12)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M4 18C10.5 18 14.6857 10 21 10"
       variants={waveVariants(0.18)}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SiriIcon.displayName = "SiriIcon";
export { SiriIcon };
