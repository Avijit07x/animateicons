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
export interface SunMoonIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SunMoonIconProps extends Omit<
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

const SunMoonIcon = forwardRef<SunMoonIconHandle, SunMoonIconProps>(
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

  const moonVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -18, 8, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const arcVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeOut",
     delay: 0.15 * duration,
    },
   },
  };

  const rayVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: (i: number) => ({
    scale: [0, 1.4, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeOut",
     times: [0, 0.6, 1],
     delay: (0.3 + i * 0.1) * duration,
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
       d="M12 2v2"
       variants={rayVariants}
       custom={0}
       style={{ transformBox: "view-box", originX: "12px", originY: "3px" }}
      />
      <m.path
       d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715"
       variants={moonVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path d="M16 12a4 4 0 0 0-4-4" variants={arcVariants} />
      <m.path
       d="m19 5-1.256 1.256"
       variants={rayVariants}
       custom={1}
       style={{ transformBox: "view-box", originX: "18.4px", originY: "5.6px" }}
      />
      <m.path
       d="M20 12h2"
       variants={rayVariants}
       custom={2}
       style={{ transformBox: "view-box", originX: "21px", originY: "12px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SunMoonIcon.displayName = "SunMoonIcon";
export { SunMoonIcon };
