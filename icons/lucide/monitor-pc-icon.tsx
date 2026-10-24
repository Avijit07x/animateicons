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
export interface MonitorPcIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MonitorPcIconProps extends Omit<
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

const MonitorPcIcon = forwardRef<MonitorPcIconHandle, MonitorPcIconProps>(
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

  const screenVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -5, 4, -2, 0],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const ledVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.6, 0.9, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
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
       variants={screenVariants}
       style={{ transformBox: "view-box", originX: "9px", originY: "15px" }}
      >
       <path d="M10 15H4a2 2 0 01-2-2V7a2 2 0 012-2h6" />
      </m.g>
      <path d="M10 19H5" />
      <path d="M9 19v-4" />
      <rect x="14" y="3" width="8" height="18" rx="1" />
      <path d="M14 11h8" />
      <path d="M14 7h8" />
      <m.path
       d="M18 17h.01"
       variants={ledVariants}
       style={{ transformBox: "view-box", originX: "18px", originY: "17px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MonitorPcIcon.displayName = "MonitorPcIcon";
export { MonitorPcIcon };
