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
export interface SaudiRiyalIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SaudiRiyalIconProps extends Omit<
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

const SaudiRiyalIcon = forwardRef<SaudiRiyalIconHandle, SaudiRiyalIconProps>(
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

  const coinVariants: Variants = {
   normal: { y: 0, scaleX: 1 },
   animate: {
    y: [0, -2, 0.5, 0],
    scaleX: [1, 0.25, 1],
    transition: {
     y: {
      duration: 0.7 * duration,
      ease: "easeInOut",
      times: [0, 0.35, 0.7, 1],
     },
     scaleX: { duration: 0.7 * duration, ease: "easeInOut" },
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
       variants={coinVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="m20 19.5-5.5 1.2" />
       <path d="M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2" />
       <path d="m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2" />
       <path d="M20 10 4 13.5" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SaudiRiyalIcon.displayName = "SaudiRiyalIcon";
export { SaudiRiyalIcon };
