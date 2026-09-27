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
export interface AppWindowIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface AppWindowIconProps extends Omit<
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

const AppWindowIcon = forwardRef<AppWindowIconHandle, AppWindowIconProps>(
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

  const windowVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.85, 1.05, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const barVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeOut",
     delay: 0.2 * duration,
    },
   },
  };

  const buttonVariants: Variants = {
   normal: { scaleY: 1 },
   animate: (i: number) => ({
    scaleY: [1, 0, 1],
    transition: {
     duration: 0.3 * duration,
     ease: "easeInOut",
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
      <m.g
       variants={windowVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <rect x="2" y="4" width="20" height="16" rx="2" />
       <m.path
        d="M10 4v4"
        variants={buttonVariants}
        custom={1}
        style={{ transformBox: "view-box", originX: "10px", originY: "6px" }}
       />
       <m.path d="M2 8h20" variants={barVariants} />
       <m.path
        d="M6 4v4"
        variants={buttonVariants}
        custom={0}
        style={{ transformBox: "view-box", originX: "6px", originY: "6px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

AppWindowIcon.displayName = "AppWindowIcon";
export { AppWindowIcon };
