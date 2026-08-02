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
export interface PackageSearchIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PackageSearchIconProps extends Omit<
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

const PackageSearchIcon = forwardRef<
 PackageSearchIconHandle,
 PackageSearchIconProps
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

  const popVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: (i: number) => ({
    scale: [0, 1.18, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.4 * duration,
     delay: (0.45 + i * 0.08) * duration,
     times: [0, 0.6, 1],
     ease: [0.34, 1.4, 0.64, 1],
    },
   }),
  };

  const handleVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.3 * duration,
     delay: 0.72 * duration,
     ease: [0.16, 1, 0.3, 1],
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
       d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
       custom={0}
       variants={bodyVariants}
      />
      <m.polyline
       points="3.29 7 12 12 20.71 7"
       custom={1}
       variants={bodyVariants}
      />
      <m.path d="m7.5 4.27 9 5.15" custom={2} variants={bodyVariants} />
      <m.path d="M12 22V12" custom={2} variants={bodyVariants} />
      <m.circle
       cx="18.5"
       cy="15.5"
       r="2.5"
       custom={0}
       variants={popVariants}
       style={{
        transformBox: "view-box",
        originX: "18.5px",
        originY: "15.5px",
       }}
      />
      <m.path d="M20.27 17.27 22 19" variants={handleVariants} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PackageSearchIcon.displayName = "PackageSearchIcon";
export { PackageSearchIcon };
