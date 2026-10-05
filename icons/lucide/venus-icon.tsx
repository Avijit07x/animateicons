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
export interface VenusIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface VenusIconProps extends Omit<
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

const VenusIcon = forwardRef<VenusIconHandle, VenusIconProps>(
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

  const circleVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1, scale: 1 },
   animate: {
    strokeDashoffset: [38, 0],
    opacity: [0, 1],
    scale: [0.9, 1.04, 1],
    transition: {
     strokeDashoffset: { duration: 0.44 * duration, ease: "easeOut" },
     opacity: { duration: 0.2 * duration },
     scale: { duration: 0.44 * duration, ease: "easeInOut" },
    },
   },
  };

  const stemVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [8, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.32 * duration,
      ease: "easeOut",
      delay: 0.16 * duration,
     },
     opacity: { duration: 0.2 * duration, delay: 0.16 * duration },
    },
   },
  };

  const crossVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [7, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.32 * duration,
      ease: "easeOut",
      delay: 0.36 * duration,
     },
     opacity: { duration: 0.2 * duration, delay: 0.36 * duration },
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
      <m.circle
       cx="12"
       cy="9"
       r="6"
       strokeDasharray="38"
       strokeDashoffset="0"
       variants={circleVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "9px" }}
      />
      <m.path
       d="M12 15v7"
       strokeDasharray="8"
       strokeDashoffset="0"
       variants={stemVariants}
      />
      <m.path
       d="M9 19h6"
       strokeDasharray="7"
       strokeDashoffset="0"
       variants={crossVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

VenusIcon.displayName = "VenusIcon";
export { VenusIcon };
