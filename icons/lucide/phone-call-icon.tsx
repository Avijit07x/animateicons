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
export interface PhoneCallIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PhoneCallIconProps extends Omit<
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

const PhoneCallIcon = forwardRef<PhoneCallIconHandle, PhoneCallIconProps>(
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

  const phoneVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -12, 10, -6, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const peaks = [1.3, 1.1];

  const waveVariants: Variants = {
   normal: { scale: 1 },
   animate: (i: number) => ({
    scale: [1, peaks[i], 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     delay: (0.15 + i * 0.1) * duration,
    },
   }),
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
       d="M13 2a9 9 0 0 1 9 9"
       variants={waveVariants}
       custom={1}
       style={{ transformBox: "view-box", originX: "13px", originY: "11px" }}
      />
      <m.path
       d="M13 6a5 5 0 0 1 5 5"
       variants={waveVariants}
       custom={0}
       style={{ transformBox: "view-box", originX: "13px", originY: "11px" }}
      />
      <m.path
       d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
       variants={phoneVariants}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PhoneCallIcon.displayName = "PhoneCallIcon";
export { PhoneCallIcon };
