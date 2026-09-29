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
export interface CaptionsIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CaptionsIconProps extends Omit<
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

const CaptionsIcon = forwardRef<CaptionsIconHandle, CaptionsIconProps>(
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

  const wordVariants = (length: number, delay: number): Variants => ({
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [length, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.3 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
     opacity: { duration: 0.25 * duration, delay: delay * duration },
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
      <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
      <m.path
       d="M7 11h2"
       strokeDasharray="2"
       strokeDashoffset="0"
       variants={wordVariants(2, 0.05)}
      />
      <m.path
       d="M13 11h4"
       strokeDasharray="4"
       strokeDashoffset="0"
       variants={wordVariants(4, 0.17)}
      />
      <m.path
       d="M7 15h4"
       strokeDasharray="4"
       strokeDashoffset="0"
       variants={wordVariants(4, 0.32)}
      />
      <m.path
       d="M15 15h2"
       strokeDasharray="2"
       strokeDashoffset="0"
       variants={wordVariants(2, 0.44)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CaptionsIcon.displayName = "CaptionsIcon";
export { CaptionsIcon };
