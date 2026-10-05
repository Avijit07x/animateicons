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

  const plusVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, 90],
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
       <path d="M14.5218 2.3423C14.0096 2.16285 13.4656 2.0496 12.9 2.01285C12.7024 2 12.4682 2 12 2C11.5317 2 11.2976 2 11.1 2.01285C8.06972 2.20977 5.65599 4.60304 5.45738 7.60758C5.44442 7.80358 5.44442 8.03572 5.44442 8.5V9.8056C5.44442 10.5353 5.44442 10.9002 5.40807 11.254C5.29504 12.354 4.9208 13.4119 4.31599 14.3409C4.12146 14.6397 3.89157 14.9246 3.43183 15.4944L3.26064 15.7066C2.80212 16.2749 2.57287 16.559 2.5228 16.789C2.4255 17.2359 2.64625 17.6913 3.05897 17.8951C3.27136 18 3.63835 18 4.37233 18H19.6277C20.3616 18 20.7286 18 20.941 17.8951C21.3537 17.6913 21.5745 17.2359 21.4772 16.789C21.4271 16.559 21.1979 16.2749 20.7394 15.7066L20.5682 15.4944C20.1898 15.0255 19.9672 14.7495 19.7918 14.5" />
      </m.g>
      <m.path
       d="M15 7.99891H21M17.995 11.0039L17.995 5.00391"
       variants={plusVariants}
       style={{ transformBox: "view-box", originX: "18px", originY: "8px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BellPlusIcon.displayName = "BellPlusIcon";
export { BellPlusIcon };
