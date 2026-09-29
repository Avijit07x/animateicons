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
export interface CameraOff01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CameraOff01IconProps extends Omit<
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

const CameraOff01Icon = forwardRef<CameraOff01IconHandle, CameraOff01IconProps>(
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
    strokeDashoffset: [30, 0],
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
       <path d="M9.71586 9.71484C8.6787 10.4376 8 11.639 8 12.999C8 15.2081 9.79086 16.999 12 16.999C13.36 16.999 14.5614 16.3203 15.2841 15.2831" />
       <path d="M6.49597 6.49597C6.38143 6.5 6.24171 6.5 6.05369 6.5C5.07361 6.5 4.58357 6.5 4.18289 6.61342C3.18055 6.89716 2.39716 7.68055 2.11342 8.68289C2 9.08357 2 9.57361 2 10.5537V14.5C2 17.3284 2 18.7426 2.87868 19.6213C3.75736 20.5 5.17157 20.5 8 20.5H16C18 20.5 19.2929 20.5 20.1893 20.1893M21.878 17.878C22 17.0498 22 15.9645 22 14.5V10.5537C22 9.57361 22 9.08357 21.8866 8.68289C21.6028 7.68055 20.8194 6.89716 19.8171 6.61342C19.4164 6.5 18.9264 6.5 17.9463 6.5C17.5803 6.5 17.3973 6.5 17.2269 6.47029C16.8046 6.39666 16.417 6.18927 16.1215 5.87871C16.0022 5.75336 15.703 5.30451 15.5 5C15.1036 4.40544 14.9054 4.10816 14.6345 3.90367C14.4691 3.77879 14.2852 3.68039 14.0895 3.612C13.7691 3.5 13.4118 3.5 12.6972 3.5H11.3028C10.5882 3.5 10.2309 3.5 9.91048 3.612C9.7148 3.68039 9.53094 3.77879 9.36549 3.90367C9.14445 4.07051 8.97183 4.2991 8.7005 4.7005" />
       <path d="M19.125 9.5H19M19.25 9.5C19.25 9.63807 19.1381 9.75 19 9.75C18.8619 9.75 18.75 9.63807 18.75 9.5C18.75 9.36193 18.8619 9.25 19 9.25C19.1381 9.25 19.25 9.36193 19.25 9.5Z" />
      </m.g>
      <m.path
       d="M2 2L22 22"
       strokeDasharray="30"
       strokeDashoffset="0"
       variants={slashVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CameraOff01Icon.displayName = "CameraOff01Icon";
export { CameraOff01Icon };
