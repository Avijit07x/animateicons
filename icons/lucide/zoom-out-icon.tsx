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
export interface ZoomOutIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ZoomOutIconProps extends Omit<
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

const ZoomOutIcon = forwardRef<ZoomOutIconHandle, ZoomOutIconProps>(
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

  const lensVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.9, 1.03, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const minusVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, 180],
    scale: [1, 0.7, 1],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
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
       variants={lensVariants}
       style={{ transformBox: "view-box", originX: "11px", originY: "11px" }}
      >
       <circle cx="11" cy="11" r="8" />
       <line x1="21" x2="16.65" y1="21" y2="16.65" />
       <m.line
        x1="8"
        x2="14"
        y1="11"
        y2="11"
        variants={minusVariants}
        style={{ transformBox: "view-box", originX: "11px", originY: "11px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ZoomOutIcon.displayName = "ZoomOutIcon";
export { ZoomOutIcon };
