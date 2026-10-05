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
export interface CopyCheckIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CopyCheckIconProps extends Omit<
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

const CopyCheckIcon = forwardRef<CopyCheckIconHandle, CopyCheckIconProps>(
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

  const frontVariants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, 1, -0.3, 0],
    y: [0, 1, -0.3, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const backVariants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, -1, 0.3, 0],
    y: [0, -1, 0.3, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const tickVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1, scale: 1 },
   animate: {
    strokeDashoffset: [9, 0],
    opacity: [0, 1],
    scale: [0.8, 1.12, 1],
    transition: {
     duration: 0.45 * duration,
     ease: "easeOut",
     delay: 0.15 * duration,
     scale: {
      duration: 0.45 * duration,
      delay: 0.19 * duration,
      times: [0, 0.6, 1],
      ease: "easeInOut",
     },
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
      <m.g variants={frontVariants}>
       <m.path
        d="m12 15 2 2 4-4"
        strokeDasharray="9"
        strokeDashoffset="0"
        variants={tickVariants}
        style={{ transformBox: "view-box", originX: "15px", originY: "15px" }}
       />
       <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      </m.g>
      <m.path
       d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
       variants={backVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CopyCheckIcon.displayName = "CopyCheckIcon";
export { CopyCheckIcon };
