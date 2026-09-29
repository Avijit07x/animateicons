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
export interface BellMinusIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BellMinusIconProps extends Omit<
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

const BellMinusIcon = forwardRef<BellMinusIconHandle, BellMinusIconProps>(
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
     duration: 0.8 * duration,
     ease: "easeInOut",
    },
   },
  };

  const minusVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, 180],
    scale: [1, 1.3, 1],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
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
       variants={bellVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "3px" }}
      >
       <path d="M16 18C16 20.2091 14.2091 22 12 22C9.79086 22 8 20.2091 8 18" />
       <path d="M16.998 4.03182C15.9804 2.87832 14.5258 2.12006 12.89 2.01285C12.694 2 12.4619 2 11.9976 2C11.5333 2 11.3012 2 11.1052 2.01285C8.10063 2.20977 5.70736 4.60304 5.51043 7.60758C5.49759 7.80358 5.49759 8.03572 5.49759 8.5V9.8056C5.49759 10.5353 5.49759 10.9002 5.46154 11.254C5.34947 12.354 4.9784 13.4119 4.37872 14.3409C4.18584 14.6397 3.9579 14.9246 3.50206 15.4944L3.33231 15.7066C2.87769 16.2749 2.65037 16.559 2.60073 16.789C2.50426 17.2359 2.72314 17.6913 3.13236 17.8951C3.34295 18 3.70683 18 4.43458 18H19.5606C20.2883 18 20.6522 18 20.8628 17.8951C21.272 17.6913 21.4909 17.2359 21.3944 16.789C21.3448 16.559 21.1175 16.2749 20.6629 15.7066L20.4931 15.4944C20.0373 14.9246 19.8093 14.6397 19.6165 14.3409C19.1537 13.624 18.8271 12.8305 18.6506 12" />
      </m.g>
      <m.path
       d="M14.9844 8H20.9844"
       variants={minusVariants}
       style={{ transformBox: "view-box", originX: "17.98px", originY: "8px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BellMinusIcon.displayName = "BellMinusIcon";
export { BellMinusIcon };
