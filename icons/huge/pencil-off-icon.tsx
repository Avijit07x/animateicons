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
export interface PencilOffIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PencilOffIconProps extends Omit<
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

const PencilOffIcon = forwardRef<PencilOffIconHandle, PencilOffIconProps>(
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

  const bodyVariants: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.4, 1],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const slashVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [29, 0],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
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
      <m.g variants={bodyVariants}>
       <path d="M16.5509 11.4392L19.1114 8.87868C19.994 7.99612 20.4353 7.55483 20.4841 7.01325C20.4921 6.92372 20.4921 6.83364 20.4841 6.74411C20.4353 6.20253 19.994 5.76124 19.1114 4.87868C18.2289 3.99612 17.7876 3.55483 17.246 3.50605C17.1565 3.49798 17.0664 3.49798 16.9769 3.50605C16.4353 3.55483 15.994 3.99612 15.1114 4.87868L12.5508 7.43934" />
       <path d="M13.9922 13.9998L9.24932 18.7426C8.38223 19.6097 7.94868 20.0433 7.39737 20.2716C6.84606 20.5 6.23293 20.5 5.00668 20.5H3.49196V18.9853C3.49196 17.759 3.49196 17.1459 3.72032 16.5946C3.94868 16.0433 4.38223 15.6097 5.24932 14.7426L9.99196 10" />
       <path d="M13.4922 6.49902L17.4922 10.499" />
      </m.g>
      <m.path
       d="M1.99219 2L21.9922 22"
       strokeDasharray="29"
       strokeDashoffset="0"
       variants={slashVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PencilOffIcon.displayName = "PencilOffIcon";
export { PencilOffIcon };
