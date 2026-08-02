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
export interface BellElectricIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BellElectricIconProps extends Omit<
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

const BellElectricIcon = forwardRef<
 BellElectricIconHandle,
 BellElectricIconProps
>(
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

  const bodyVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -2.5, 2.5, -2, 1.5, -1, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     times: [0, 0.16, 0.34, 0.52, 0.7, 0.86, 1],
    },
   },
  };

  const wave1Variants: Variants = {
   normal: { opacity: 1, scale: 1 },
   animate: {
    opacity: [0, 1, 0.4, 1],
    scale: [0.85, 1, 0.9, 1],
    transition: {
     duration: 0.9 * duration,
     times: [0, 0.3, 0.6, 1],
     ease: "easeOut",
    },
   },
  };

  const wave2Variants: Variants = {
   normal: { opacity: 1, scale: 1 },
   animate: {
    opacity: [0, 1, 0.4, 1],
    scale: [0.85, 1, 0.9, 1],
    transition: {
     duration: 0.9 * duration,
     times: [0, 0.3, 0.6, 1],
     ease: "easeOut",
     delay: 0.1 * duration,
    },
   },
  };

  const buttonVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.75, 1, 0.85, 1],
    transition: {
     duration: 0.9 * duration,
     times: [0, 0.15, 0.4, 0.6, 1],
     ease: "easeInOut",
    },
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
      variants={bodyVariants}
      style={{ transformOrigin: "center" }}
     >
      <m.path
       d="M18.518 17.347A7 7 0 0 1 14 19"
       variants={wave1Variants}
       style={{ transformBox: "view-box", originX: "14px", originY: "18px" }}
      />
      <m.path
       d="M18.8 4A11 11 0 0 1 20 9"
       variants={wave2Variants}
       style={{ transformBox: "view-box", originX: "19px", originY: "6px" }}
      />
      <path d="M9 9h.01" />
      <m.circle
       cx="20"
       cy="16"
       r="2"
       variants={buttonVariants}
       style={{ transformBox: "view-box", originX: "20px", originY: "16px" }}
      />
      <circle cx="9" cy="9" r="7" />
      <rect x="4" y="16" width="10" height="6" rx="2" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BellElectricIcon.displayName = "BellElectricIcon";
export { BellElectricIcon };
