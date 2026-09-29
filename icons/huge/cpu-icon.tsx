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
export interface CpuIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CpuIconProps extends Omit<
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

const CpuIcon = forwardRef<CpuIconHandle, CpuIconProps>(
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

  const chipVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.05, 0.97, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const pinVariants = (delay: number): Variants => ({
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.1, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

  const coreVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.35, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     delay: 0.2 * duration,
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
       d="M4 12C4 8.22876 4 6.34315 5.17157 5.17157C6.34315 4 8.22876 4 12 4C15.7712 4 17.6569 4 18.8284 5.17157C20 6.34315 20 8.22876 20 12C20 15.7712 20 17.6569 18.8284 18.8284C17.6569 20 15.7712 20 12 20C8.22876 20 6.34315 20 5.17157 18.8284C4 17.6569 4 15.7712 4 12Z"
       variants={chipVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path d="M9.5 2V4" variants={pinVariants(0)} />
      <m.path d="M14.5 2V4" variants={pinVariants(0.08)} />
      <m.path d="M22 9.5L20 9.5" variants={pinVariants(0.16)} />
      <m.path d="M22 14.5L20 14.5" variants={pinVariants(0.24)} />
      <m.path d="M14.5 20V22" variants={pinVariants(0.32)} />
      <m.path d="M9.5 20V22" variants={pinVariants(0.4)} />
      <m.path d="M4 14.5L2 14.5" variants={pinVariants(0.48)} />
      <m.path d="M4 9.5L2 9.5" variants={pinVariants(0.56)} />
      <m.path
       d="M13 9L9 13"
       variants={coreVariants}
       style={{ transformBox: "view-box", originX: "11px", originY: "11px" }}
      />
      <m.path
       d="M15 13L13 15"
       variants={coreVariants}
       style={{ transformBox: "view-box", originX: "14px", originY: "14px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CpuIcon.displayName = "CpuIcon";
export { CpuIcon };
