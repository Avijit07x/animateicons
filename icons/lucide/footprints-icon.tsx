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
export interface FootprintsIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FootprintsIconProps extends Omit<
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

const FootprintsIcon = forwardRef<FootprintsIconHandle, FootprintsIconProps>(
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

  const footVariants = (delay: number): Variants => ({
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [40, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.5 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
     opacity: {
      duration: 0.25 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
    },
   },
  });

  const heelVariants = (delay: number): Variants => ({
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [5, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.25 * duration,
      ease: "easeOut",
      delay: delay * duration,
     },
     opacity: {
      duration: 0.25 * duration,
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
       d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"
       strokeDasharray="40"
       strokeDashoffset="0"
       variants={footVariants(0)}
      />
      <m.path
       d="M4 13h4"
       strokeDasharray="5"
       strokeDashoffset="0"
       variants={heelVariants(0.3)}
      />
      <m.path
       d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"
       strokeDasharray="40"
       strokeDashoffset="0"
       variants={footVariants(0.3)}
      />
      <m.path
       d="M16 17h4"
       strokeDasharray="5"
       strokeDashoffset="0"
       variants={heelVariants(0.6)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FootprintsIcon.displayName = "FootprintsIcon";
export { FootprintsIcon };
