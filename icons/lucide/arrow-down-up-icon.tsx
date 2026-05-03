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
export interface ArrowDownUpIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ArrowDownUpIconProps extends Omit<
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

const ArrowDownUpIcon = forwardRef<ArrowDownUpIconHandle, ArrowDownUpIconProps>(
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

  const iconVariants: Variants = {
   normal: { scale: 1, rotate: 0 },
   animate: {
    scale: [1, 1.08, 0.96, 1],
    rotate: [0, -4, 2, 0],
    transition: { duration: 0.9 * duration, ease: "easeInOut" },
   },
  };

  const downArrowVariants: Variants = {
   normal: { y: 0, opacity: 1 },
   animate: {
    y: [-4, 2, 0],
    opacity: [0, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeOut",
     delay: 0.1,
    },
   },
  };

  const upArrowVariants: Variants = {
   normal: { y: 0, opacity: 1 },
   animate: {
    y: [4, -2, 0],
    opacity: [0, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeOut",
     delay: 0.15,
    },
   },
  };

  const lineVariants: Variants = {
   normal: { pathLength: 1 },
   animate: {
    pathLength: [0, 1],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
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
      variants={iconVariants}
     >
      <m.path
       d="m3 16 4 4 4-4"
       variants={downArrowVariants}
       initial="normal"
       animate={controls}
      />
      <m.path
       d="M7 20V4"
       variants={lineVariants}
       initial="normal"
       animate={controls}
      />
      <m.path
       d="m21 8-4-4-4 4"
       variants={upArrowVariants}
       initial="normal"
       animate={controls}
      />
      <m.path
       d="M17 4v16"
       variants={lineVariants}
       initial="normal"
       animate={controls}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ArrowDownUpIcon.displayName = "ArrowDownUpIcon";
export { ArrowDownUpIcon };
