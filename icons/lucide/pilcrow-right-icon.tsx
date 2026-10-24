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
export interface PilcrowRightIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PilcrowRightIconProps extends Omit<
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

const PilcrowRightIcon = forwardRef<
 PilcrowRightIconHandle,
 PilcrowRightIconProps
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

  const stemVariants: Variants = {
   normal: { scaleY: 1 },
   animate: (i: number) => ({
    scaleY: [1, 0.65, 1.04, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
     delay: i * 0.1 * duration,
    },
   }),
  };

  const lineVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: (dir: number) => ({
    strokeDashoffset: [26 * dir, 0],
    transition: {
     duration: 0.45 * duration,
     ease: "easeOut",
     delay: 0.05 * duration,
    },
   }),
  };

  const headVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: (dir: number) => ({
    strokeDashoffset: [6 * dir, 0],
    transition: {
     duration: 0.2 * duration,
     ease: "easeOut",
     delay: 0.4 * duration,
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
       d="M10 3v11"
       variants={stemVariants}
       custom={0}
       style={{ transformBox: "view-box", originX: "10px", originY: "3px" }}
      />
      <path d="M10 9H7a1 1 0 0 1 0-6h8" />
      <m.path
       d="M14 3v11"
       variants={stemVariants}
       custom={1}
       style={{ transformBox: "view-box", originX: "14px", originY: "3px" }}
      />
      <m.path
       d="m18 14 4 4H2"
       strokeDasharray="26 60"
       strokeDashoffset="0"
       variants={lineVariants}
       custom={-1}
      />
      <m.path
       d="m22 18-4 4"
       strokeDasharray="6 20"
       strokeDashoffset="0"
       variants={headVariants}
       custom={-1}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PilcrowRightIcon.displayName = "PilcrowRightIcon";
export { PilcrowRightIcon };
