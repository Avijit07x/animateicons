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
export interface WindIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface WindIconProps extends Omit<
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

const WindIcon = forwardRef<WindIconHandle, WindIconProps>(
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

  const gustVariants = (length: number, i: number): Variants => ({
   normal: { strokeDashoffset: 0, opacity: 1, x: 0 },
   animate: {
    strokeDashoffset: [-length, 0],
    opacity: [0, 1],
    x: [-3, 0],
    transition: {
     strokeDashoffset: {
      duration: 0.55 * duration,
      ease: "easeOut",
      delay: i * 0.12 * duration,
     },
     opacity: { duration: 0.25 * duration, delay: i * 0.12 * duration },
     x: {
      duration: 0.55 * duration,
      ease: "easeOut",
      delay: i * 0.12 * duration,
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
       d="M12.8 19.6A2 2 0 1 0 14 16H2"
       strokeDasharray="21 21"
       strokeDashoffset="0"
       variants={gustVariants(21, 2)}
      />
      <m.path
       d="M17.5 8a2.5 2.5 0 1 1 2 4H2"
       strokeDasharray="29 29"
       strokeDashoffset="0"
       variants={gustVariants(29, 1)}
      />
      <m.path
       d="M9.8 4.4A2 2 0 1 1 11 8H2"
       strokeDasharray="18 18"
       strokeDashoffset="0"
       variants={gustVariants(18, 0)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

WindIcon.displayName = "WindIcon";
export { WindIcon };
