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
export interface Wifi01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Wifi01IconProps extends Omit<
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

const Wifi01Icon = forwardRef<Wifi01IconHandle, Wifi01IconProps>(
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

  const arcVariants = (delay: number): Variants => ({
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.15, 1],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

  const dotVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.6, 1],
    transition: { duration: 0.4 * duration, ease: "easeInOut" },
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
       d="M8.25 14.5C10.25 12.5 13.75 12.5 15.75 14.5"
       variants={arcVariants(0.1)}
      />
      <m.path
       d="M18.5 11.5C14.7324 8.16667 9.5 8.16667 5.5 11.5"
       variants={arcVariants(0.22)}
      />
      <m.path
       d="M2 8.5C8.31579 3.16669 15.6842 3.16668 22 8.49989"
       variants={arcVariants(0.34)}
      />
      <m.circle
       cx="12"
       cy="18"
       r="1.5"
       variants={dotVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "18px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Wifi01Icon.displayName = "Wifi01Icon";
export { Wifi01Icon };
