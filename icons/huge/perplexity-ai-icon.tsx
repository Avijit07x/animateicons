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
export interface PerplexityAiIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PerplexityAiIconProps extends Omit<
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

const PerplexityAiIcon = forwardRef<
 PerplexityAiIconHandle,
 PerplexityAiIconProps
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
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) controls.start("normal");
    else onMouseLeave?.(e as any);
   },
   [controls, onMouseLeave],
  );

  const leftHornVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -20, 6, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const rightHornVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, 20, -6, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const coreVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.1, 0.96, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
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
      <path d="M6 16C4.58579 16 3.87868 16 3.43934 15.5607C3 15.1213 3 14.4142 3 13V11C3 9.58579 3 8.87868 3.43934 8.43934C3.87868 8 4.58579 8 6 8H18C19.4142 8 20.1213 8 20.5607 8.43934C21 8.87868 21 9.58579 21 11V13C21 14.4142 21 15.1213 20.5607 15.5607C20.1213 16 19.4142 16 18 16" />
      <path d="M12 2V22" />
      <m.path
       d="M5 8V2.70711C5 2.31658 5.31658 2 5.70711 2C5.89464 2 6.0745 2.0745 6.20711 2.20711L12 8"
       variants={leftHornVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "8px" }}
      />
      <m.path
       d="M19 8V2.70711C19 2.31658 18.6834 2 18.2929 2C18.1054 2 17.9255 2.0745 17.7929 2.20711L12 8"
       variants={rightHornVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "8px" }}
      />
      <m.path
       d="M6.64855 12.9055L12 8L17.3514 12.9055C17.7647 13.2843 18 13.8192 18 14.3798V20.3067C18 20.6896 17.6896 21 17.3067 21C17.1114 21 16.9251 20.9176 16.7937 20.7731L12 15.5L7.20631 20.7731C7.07491 20.9176 6.88864 21 6.6933 21C6.3104 21 6 20.6896 6 20.3067V14.3798C6 13.8192 6.23529 13.2843 6.64855 12.9055Z"
       variants={coreVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "14.5px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PerplexityAiIcon.displayName = "PerplexityAiIcon";
export { PerplexityAiIcon };
