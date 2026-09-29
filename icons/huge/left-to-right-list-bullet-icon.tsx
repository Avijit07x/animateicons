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
export interface LeftToRightListBulletIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LeftToRightListBulletIconProps extends Omit<
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

const LeftToRightListBulletIcon = forwardRef<
 LeftToRightListBulletIconHandle,
 LeftToRightListBulletIconProps
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

  const rowVariants = (delay: number): Variants => ({
   normal: { scaleX: 1 },
   animate: {
    scaleX: [0.3, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeOut",
     delay: delay * duration,
    },
   },
  });

  const markVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.8, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

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
       d="M8 5.5L20 5.5"
       variants={rowVariants(0)}
       style={{ transformBox: "view-box", originX: "8px", originY: "5.5px" }}
      />
      <m.path
       d="M8 12.5L20 12.5"
       variants={rowVariants(0.12)}
       style={{ transformBox: "view-box", originX: "8px", originY: "12.5px" }}
      />
      <m.path
       d="M8 19.5L20 19.5"
       variants={rowVariants(0.24)}
       style={{ transformBox: "view-box", originX: "8px", originY: "19.5px" }}
      />
      <m.path
       d="M4.375 5.5H4.25M4.5 5.5C4.5 5.63807 4.38807 5.75 4.25 5.75C4.11193 5.75 4 5.63807 4 5.5C4 5.36193 4.11193 5.25 4.25 5.25C4.38807 5.25 4.5 5.36193 4.5 5.5Z"
       variants={markVariants(0)}
       style={{ transformBox: "view-box", originX: "4.25px", originY: "5.5px" }}
      />
      <m.path
       d="M4.375 12.5H4.25M4.5 12.5C4.5 12.6381 4.38807 12.75 4.25 12.75C4.11193 12.75 4 12.6381 4 12.5C4 12.3619 4.11193 12.25 4.25 12.25C4.38807 12.25 4.5 12.3619 4.5 12.5Z"
       variants={markVariants(0.12)}
       style={{
        transformBox: "view-box",
        originX: "4.25px",
        originY: "12.5px",
       }}
      />
      <m.path
       d="M4.375 19.5H4.25M4.5 19.5C4.5 19.6381 4.38807 19.75 4.25 19.75C4.11193 19.75 4 19.6381 4 19.5C4 19.3619 4.11193 19.25 4.25 19.25C4.38807 19.25 4.5 19.3619 4.5 19.5Z"
       variants={markVariants(0.24)}
       style={{
        transformBox: "view-box",
        originX: "4.25px",
        originY: "19.5px",
       }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

LeftToRightListBulletIcon.displayName = "LeftToRightListBulletIcon";
export { LeftToRightListBulletIcon };
