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
export interface BellPlusIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BellPlusIconProps extends Omit<
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

const BellPlusIcon = forwardRef<BellPlusIconHandle, BellPlusIconProps>(
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
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     controls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [controls, onMouseLeave],
  );

  const bellVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -12, 10, -6, 3, 0],
    transition: { duration: 1.4 * duration, ease: "easeInOut", repeat: 0 },
   },
  };

  const clapperVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, -3, 3, -2, 2, 0],
    transition: { duration: 1.4 * duration, ease: "easeInOut", repeat: 0 },
   },
  };

  const plusVariants: Variants = {
   normal: { scale: 1, opacity: 1, rotate: 0 },
   animate: {
    scale: [1, 1.3, 0.9, 1.1, 1],
    rotate: [0, 45, -45, 0],
    opacity: [1, 0.9, 1],
    transition: { duration: 1.4 * duration, ease: "easeInOut", repeat: 0 },
   },
  };

  return (
   <LazyMotion features={domMin} strict>
    <m.div
     className={cn("relative inline-flex", className)}
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
      variants={bellVariants}
     >
      <m.path d="M10.268 21a2 2 0 0 0 3.464 0" variants={clapperVariants} />
      <m.path d="M15 8h6" variants={plusVariants} />
      <m.path d="M18 5v6" variants={plusVariants} />
      <path d="M20.002 14.464a9 9 0 0 0 .738.863A1 1 0 0 1 20 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 8.75-5.332" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BellPlusIcon.displayName = "BellPlusIcon";
export { BellPlusIcon };
