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
export interface BellDotIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BellDotIconProps extends Omit<
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

const BellDotIcon = forwardRef<BellDotIconHandle, BellDotIconProps>(
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

  const bellVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -12, 10.2, -6.0, 3.0, 0],
    transition: {
     duration: 1.1 * duration,
     ease: "easeInOut",
    },
   },
  };

  const dotVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.6, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
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
      style={{ overflow: "visible" }}
     >
      <m.g
       variants={bellVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "3px" }}
      >
       <path d="M19 11V12.7558C19 13.5514 19.3161 14.3145 19.8787 14.8771L20.4819 15.4803C20.8136 15.8121 21 16.262 21 16.7311C21 17.708 20.208 18.5 19.2311 18.5H4.76887C3.79195 18.5 3 17.708 3 16.7311C3 16.262 3.18636 15.8121 3.51809 15.4803L4.12132 14.8771C4.68393 14.3145 5 13.5514 5 12.7558V10C5 6.13401 8.13401 3 12 3" />
       <path d="M15.5 18.5C15.5 20.433 13.933 22 12 22C10.067 22 8.5 20.433 8.5 18.5" />
      </m.g>
      <m.path
       d="M21 5C21 3.34315 19.6568 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65684 16.3431 8 18 8C19.6568 8 21 6.65684 21 5Z"
       variants={dotVariants}
       style={{ transformBox: "view-box", originX: "18px", originY: "5px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BellDotIcon.displayName = "BellDotIcon";
export { BellDotIcon };
