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
export interface SkypeIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SkypeIconProps extends Omit<
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

const SkypeIcon = forwardRef<SkypeIconHandle, SkypeIconProps>(
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

  const bubbleVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.05, 1],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  const drawVariants = (
   length: number,
   delay: number,
   dur = 0.35,
  ): Variants => ({
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [length, 0],
    transition: {
     duration: dur * duration,
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
      <m.path
       d="M15 10C15 8.89543 13.6569 8 12 8C10.3431 8 9 8.89543 9 10C9 11.1046 10.3431 12 12 12C13.6569 12 15 12.8954 15 14C15 15.1046 13.6569 16 12 16C10.3431 16 9 15.1046 9 14"
       strokeDasharray="24"
       strokeDashoffset="0"
       variants={drawVariants(24, 0.15, 0.6)}
      />
      <m.path
       d="M18 20C20.2091 20 22 18.2091 22 16C22 14.9608 21.6037 14.0142 20.954 13.303C20.2792 12.5642 20.0562 12.2608 19.9675 11.2774C19.8052 9.47708 19.035 7.72126 17.6569 6.34315C15.4775 4.16375 12.3535 3.50467 9.60274 4.36591C8.65975 4.66116 8.29221 4.5711 7.3493 4.23329C6.92776 4.08227 6.47349 4 6 4C3.79086 4 2 5.79086 2 8C2 9.03918 2.39628 9.98581 3.04596 10.697C3.72081 11.4358 3.94384 11.7392 4.0325 12.7226C4.19482 14.5229 4.96503 16.2787 6.34315 17.6569C8.52254 19.8363 11.6465 20.4953 14.3973 19.6341C15.3403 19.3388 15.7078 19.4289 16.6507 19.7667C17.0722 19.9177 17.5265 20 18 20Z"
       variants={bubbleVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SkypeIcon.displayName = "SkypeIcon";
export { SkypeIcon };
