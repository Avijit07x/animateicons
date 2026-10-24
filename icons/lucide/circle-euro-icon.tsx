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
export interface CircleEuroIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CircleEuroIconProps extends Omit<
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

const CircleEuroIcon = forwardRef<CircleEuroIconHandle, CircleEuroIconProps>(
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

  const bounceVariants: Variants = {
   normal: { y: 0, scaleX: 1, scaleY: 1 },
   animate: {
    y: [0, -1.5, 0, -0.5, 0],
    scaleX: [1, 0.9, 1.08, 0.98, 1],
    scaleY: [1, 0.96, 0.88, 1, 1],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.3, 0.55, 0.75, 1],
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
      <m.g
       variants={bounceVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "22px" }}
      >
       <path d="M15 9.4a4 4 0 1 0 0 5.2" />
       <path d="M7 12h5" />
       <circle cx="12" cy="12" r="10" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CircleEuroIcon.displayName = "CircleEuroIcon";
export { CircleEuroIcon };
