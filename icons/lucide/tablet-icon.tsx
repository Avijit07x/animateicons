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
export interface TabletIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface TabletIconProps extends Omit<
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

const TabletIcon = forwardRef<TabletIconHandle, TabletIconProps>(
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

  const tabletVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -4, 3, -1, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const buttonVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.5, 1.6, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     delay: 0.15 * duration,
     times: [0, 0.3, 0.65, 1],
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
       variants={tabletVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
       <m.line
        x1="12"
        x2="12.01"
        y1="18"
        y2="18"
        variants={buttonVariants}
        style={{ transformBox: "view-box", originX: "12px", originY: "18px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

TabletIcon.displayName = "TabletIcon";
export { TabletIcon };
