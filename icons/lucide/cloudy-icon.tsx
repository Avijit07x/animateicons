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
export interface CloudyIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CloudyIconProps extends Omit<
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

const CloudyIcon = forwardRef<CloudyIconHandle, CloudyIconProps>(
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

  const cloudVariants = (delay: number, length: number): Variants => ({
   normal: { strokeDashoffset: 0, opacity: 1, x: 0 },
   animate: {
    strokeDashoffset: [length, 0],
    opacity: [0, 1],
    x: [-3, 0],
    transition: {
     strokeDashoffset: {
      duration: 0.55 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
     opacity: {
      duration: 0.25 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
     x: {
      duration: 0.55 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
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
       d="M21.832 9A3 3 0 0 0 19 7h-2.207a5.5 5.5 0 0 0-10.72.61"
       strokeDasharray="22"
       strokeDashoffset="0"
       variants={cloudVariants(0.15, 22)}
      />
      <m.path
       d="M17.5 12a1 1 0 1 1 0 9H9.006a7 7 0 1 1 6.702-9z"
       strokeDasharray="57"
       strokeDashoffset="0"
       variants={cloudVariants(0, 57)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CloudyIcon.displayName = "CloudyIcon";
export { CloudyIcon };
