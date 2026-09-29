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
export interface BracesIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BracesIconProps extends Omit<
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

const BracesIcon = forwardRef<BracesIconHandle, BracesIconProps>(
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

  const leftVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, 1.5, -1.5, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.75, 1],
    },
   },
  };

  const rightVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, -1.5, 1.5, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.75, 1],
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
       d="M8 3C7.5355 3 7.30325 3 7.10891 3.03078C6.03918 3.20021 5.20021 4.03918 5.03078 5.10891C5 5.30325 5 5.5355 5 6L5 10C5 11.1046 4.10457 12 3 12C4.10406 11.9982 5 12.8928 5 13.9968V18C5 18.4645 5 18.6968 5.03078 18.8911C5.20021 19.9608 6.03918 20.7998 7.10891 20.9692C7.30325 21 7.5355 21 8 21"
       variants={leftVariants}
      />
      <m.path
       d="M16 3C16.4645 3 16.6968 3 16.8911 3.03078C17.9608 3.20021 18.7998 4.03918 18.9692 5.10891C19 5.30325 19 5.5355 19 6L19 10C19 11.1046 19.8954 12 21 12C19.8959 11.9982 19 12.8928 19 13.9968V18C19 18.4645 19 18.6968 18.9692 18.8911C18.7998 19.9608 17.9608 20.7998 16.8911 20.9692C16.6968 21 16.4645 21 16 21"
       variants={rightVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BracesIcon.displayName = "BracesIcon";
export { BracesIcon };
