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
export interface MonitorSmartphoneIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MonitorSmartphoneIconProps extends Omit<
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

const MonitorSmartphoneIcon = forwardRef<
 MonitorSmartphoneIconHandle,
 MonitorSmartphoneIconProps
>(
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

  const monitorVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -4, 3, -1.5, 0],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const phoneVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -9, 8, -4, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     delay: 0.15 * duration,
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
      <m.path
       d="M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8"
       variants={monitorVariants}
       style={{ transformBox: "view-box", originX: "10px", originY: "19px" }}
      />
      <path d="M10 19v-3.96 3.15" />
      <path d="M7 19h5" />
      <m.rect
       width="6"
       height="10"
       x="16"
       y="12"
       rx="2"
       variants={phoneVariants}
       style={{ transformBox: "view-box", originX: "19px", originY: "17px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MonitorSmartphoneIcon.displayName = "MonitorSmartphoneIcon";
export { MonitorSmartphoneIcon };
