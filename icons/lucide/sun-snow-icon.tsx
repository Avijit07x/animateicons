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
export interface SunSnowIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SunSnowIconProps extends Omit<
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

const SunSnowIcon = forwardRef<SunSnowIconHandle, SunSnowIconProps>(
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
   normal: { pathLength: 1, opacity: 1 },
   animate: (i: number) => ({
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.5 * duration,
     delay: i * 0.08 * duration,
     ease: [0.16, 1, 0.3, 1],
    },
   }),
  };

  const rayVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: (i: number) => ({
    scale: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.3 * duration,
     delay: (0.35 + i * 0.05) * duration,
     ease: [0.34, 1.3, 0.64, 1],
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
      <m.path d="M10 9a3 3 0 0 0 0 6" custom={0} variants={bodyVariants} />
      <m.path d="m17 21-3-6 1.5-3H22" custom={1} variants={bodyVariants} />
      <m.path d="m17 3-3 6 1.5 3" custom={1} variants={bodyVariants} />
      <m.path
       d="M10 4V3"
       custom={0}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "10px", originY: "12px" }}
      />
      <m.path
       d="M10 21v-1"
       custom={1}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "10px", originY: "12px" }}
      />
      <m.path
       d="M2 12h1"
       custom={2}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "10px", originY: "12px" }}
      />
      <m.path
       d="m4.34 6.34-.7-.7"
       custom={3}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "10px", originY: "12px" }}
      />
      <m.path
       d="m3.64 18.36.7-.7"
       custom={4}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "10px", originY: "12px" }}
      />
      <m.path
       d="m14 4 1.25 2.5L18 6"
       custom={0}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "17px", originY: "12px" }}
      />
      <m.path
       d="m14 20 1.25-2.5L18 18"
       custom={1}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "17px", originY: "12px" }}
      />
      <m.path
       d="m20 10-1.5 2 1.5 2"
       custom={2}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "17px", originY: "12px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SunSnowIcon.displayName = "SunSnowIcon";
export { SunSnowIcon };
