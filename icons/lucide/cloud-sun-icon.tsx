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
export interface CloudSunIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CloudSunIconProps extends Omit<
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

const CloudSunIcon = forwardRef<CloudSunIconHandle, CloudSunIconProps>(
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

  const cloudVariants: Variants = {
   normal: { x: 0, pathLength: 1, opacity: 1 },
   animate: (i: number) => ({
    x: [-6, 0],
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     x: {
      duration: 0.6 * duration,
      delay: i * 0.1 * duration,
      ease: [0.34, 1.2, 0.64, 1],
     },
     pathLength: {
      duration: 0.5 * duration,
      delay: i * 0.1 * duration,
      ease: [0.16, 1, 0.3, 1],
     },
     opacity: { duration: 0.2 * duration, delay: i * 0.1 * duration },
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
       d="M15.947 12.65a4 4 0 0 0-5.925-4.128"
       custom={0}
       variants={bodyVariants}
      />
      <m.path
       d="M12 2v2"
       custom={0}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "13px", originY: "8px" }}
      />
      <m.path
       d="m4.93 4.93 1.41 1.41"
       custom={1}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "13px", originY: "8px" }}
      />
      <m.path
       d="M20 12h2"
       custom={2}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "13px", originY: "8px" }}
      />
      <m.path
       d="m19.07 4.93-1.41 1.41"
       custom={3}
       variants={rayVariants}
       style={{ transformBox: "view-box", originX: "13px", originY: "8px" }}
      />
      <m.path
       d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"
       custom={0}
       variants={cloudVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CloudSunIcon.displayName = "CloudSunIcon";
export { CloudSunIcon };
