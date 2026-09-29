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
export interface LaughIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LaughIconProps extends Omit<
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

const LaughIcon = forwardRef<LaughIconHandle, LaughIconProps>(
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

  const featuresVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -1.2, 0.6, -1.2, 0.6, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
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
      <m.g variants={featuresVariants}>
       <path d="M6.99609 9.5C6.99609 8.67157 7.66767 8 8.49609 8C9.32452 8 9.99609 8.67157 9.99609 9.5M13.9961 9.5C13.9961 8.67157 14.6677 8 15.4961 8C16.3245 8 16.9961 8.67157 16.9961 9.5" />
       <path d="M13.995 14C14.9572 14 15.4383 14 15.7288 14.4902C16.0193 14.9804 15.8482 15.2929 15.506 15.9179C14.8268 17.1587 13.5091 18 11.995 18C10.4808 18 9.16308 17.1587 8.48389 15.9179C8.14173 15.2929 7.97065 14.9804 8.26114 14.4902C8.55163 14 9.03274 14 9.99495 14H13.995Z" />
      </m.g>
      <circle cx="11.9961" cy="12" r="10" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

LaughIcon.displayName = "LaughIcon";
export { LaughIcon };
