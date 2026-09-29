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
export interface SparklesIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SparklesIconProps extends Omit<
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

const SparklesIcon = forwardRef<SparklesIconHandle, SparklesIconProps>(
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

  const bigVariants: Variants = {
   normal: { rotate: 0, scale: 1 },
   animate: {
    rotate: [0, 14, -8, 0],
    scale: [1, 1.1, 0.95, 1],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const plusVariants: Variants = {
   normal: { rotate: 0, scale: 1 },
   animate: {
    rotate: [0, 45, 0],
    scale: [1, 1.3, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     delay: 0.12 * duration,
    },
   },
  };

  const dotVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.4, 0.9, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     delay: 0.25 * duration,
     times: [0, 0.35, 0.7, 1],
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
      <m.path
       d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"
       variants={bigVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.g
       variants={plusVariants}
       style={{ transformBox: "view-box", originX: "20px", originY: "4px" }}
      >
       <path d="M20 2v4" />
       <path d="M22 4h-4" />
      </m.g>
      <m.circle
       cx="4"
       cy="20"
       r="2"
       variants={dotVariants}
       style={{ transformBox: "view-box", originX: "4px", originY: "20px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SparklesIcon.displayName = "SparklesIcon";
export { SparklesIcon };
