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
export interface SunsetIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SunsetIconProps extends Omit<
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

const SunsetIcon = forwardRef<SunsetIconHandle, SunsetIconProps>(
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

  const setVariants: Variants = {
   normal: { y: 0, opacity: 1 },
   animate: {
    y: [-7, 0],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.55 * duration,
     delay: 0.3 * duration,
     times: [0, 0.7, 1],
     ease: [0.34, 1.3, 0.6, 1],
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
      <m.path d="M22 22H2" custom={0} variants={bodyVariants} />
      <m.path d="M2 18h2" custom={0} variants={bodyVariants} />
      <m.path d="M20 18h2" custom={0} variants={bodyVariants} />
      <m.path d="M16 18a4 4 0 0 0-8 0" custom={1} variants={bodyVariants} />
      <m.path
       d="m4.93 10.93 1.41 1.41"
       custom={0}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "14px" }}
      />
      <m.path
       d="m19.07 10.93-1.41 1.41"
       custom={1}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "14px" }}
      />
      <m.path d="M12 10V2" variants={setVariants} />
      <m.path d="m16 6-4 4-4-4" variants={setVariants} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SunsetIcon.displayName = "SunsetIcon";
export { SunsetIcon };
