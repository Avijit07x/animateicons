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
export interface SortingUpIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SortingUpIconProps extends Omit<
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

const SortingUpIcon = forwardRef<SortingUpIconHandle, SortingUpIconProps>(
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

  const arrowVariants = (dy: number, delay: number): Variants => ({
   normal: { y: 0 },
   animate: {
    y: [0, dy, 0],
    transition: {
     duration: 0.5 * duration,
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
      <path d="M18 8.5L5.9999 8.4999" />
      <path d="M21 12.5L3 12.5" />
      <m.path
       d="M12 8.5L12 2.5M12 2.5L14 4.5M12 2.5L10 4.5"
       variants={arrowVariants(-1.5, 0.1)}
      />
      <m.path
       d="M16 21.5L16 15.5M16 15.5L18 17.5M16 15.5L14 17.5"
       variants={arrowVariants(-1.5, 0.2)}
      />
      <m.path
       d="M8 21.5L8 15.5M8 15.5L10 17.5M8 15.5L6 17.5"
       variants={arrowVariants(-1.5, 0)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SortingUpIcon.displayName = "SortingUpIcon";
export { SortingUpIcon };
