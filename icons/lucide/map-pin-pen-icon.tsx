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
export interface MapPinPenIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MapPinPenIconProps extends Omit<
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

const MapPinPenIcon = forwardRef<MapPinPenIconHandle, MapPinPenIconProps>(
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

  const pinVariants: Variants = {
   normal: { y: 0, rotate: 0 },
   animate: {
    y: [0, 1, 0.3, 0],
    rotate: [0, -9, 7, -3, 0],
    transition: {
     y: {
      duration: 0.5 * duration,
      ease: "easeInOut",
      times: [0, 0.3, 0.6, 1],
     },
     rotate: { duration: 0.7 * duration, ease: "easeInOut" },
    },
   },
  };

  const penVariants: Variants = {
   normal: { x: 0, y: 0, rotate: 0 },
   animate: {
    x: [0, -1.5, 1, -1, 0],
    y: [0, 1, -0.5, 0.8, 0],
    rotate: [0, -8, 4, -4, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
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
       variants={pinVariants}
       style={{ transformBox: "view-box", originX: "10px", originY: "22px" }}
      >
       <path d="M17.97 9.304A8 8 0 0 0 2 10c0 4.69 4.887 9.562 7.022 11.468" />
       <circle cx="10" cy="10" r="3" />
      </m.g>
      <m.path
       d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
       variants={penVariants}
       style={{
        transformBox: "view-box",
        originX: "13.5px",
        originY: "21.5px",
       }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MapPinPenIcon.displayName = "MapPinPenIcon";
export { MapPinPenIcon };
