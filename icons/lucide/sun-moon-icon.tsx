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
export interface SunMoonIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SunMoonIconProps extends Omit<
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

const SunMoonIcon = forwardRef<SunMoonIconHandle, SunMoonIconProps>(
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
    rotate: [0, 15, -8, 3, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const rayVariants = (dx: number, dy: number): Variants => ({
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, dx, 0],
    y: [0, dy, 0],
    transition: { duration: 0.6 * duration, ease: "easeInOut" },
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
      <m.path d="M12 2v2" variants={rayVariants(0, -0.9)} />
      <m.path
       d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715"
       variants={moonVariants}
       style={{ transformBox: "view-box", originX: "9px", originY: "15px" }}
      />
      <path d="M16 12a4 4 0 0 0-4-4" />
      <m.path d="m19 5-1.256 1.256" variants={rayVariants(0.65, -0.65)} />
      <m.path d="M20 12h2" variants={rayVariants(0.9, 0)} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SunMoonIcon.displayName = "SunMoonIcon";
export { SunMoonIcon };
