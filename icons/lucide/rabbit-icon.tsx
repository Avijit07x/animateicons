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
export interface RabbitIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface RabbitIconProps extends Omit<
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

const RabbitIcon = forwardRef<RabbitIconHandle, RabbitIconProps>(
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

  const earVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -12, 10, -5, 0],
    transition: { duration: 0.6 * duration, ease: "easeInOut" },
   },
  };

  const tailVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -25, 20, -10, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     delay: 0.05 * duration,
    },
   },
  };

  const blinkVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.1, 1],
    transition: {
     duration: 0.3 * duration,
     ease: "easeInOut",
     delay: 0.2 * duration,
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
      <path d="M13 16a3 3 0 0 1 2.24 5" />
      <m.path
       d="M18 12h.01"
       variants={blinkVariants}
       style={{ transformBox: "view-box", originX: "18px", originY: "12px" }}
      />
      <path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3" />
      <m.path
       d="M20 8.54V4a2 2 0 1 0-4 0v3"
       variants={earVariants}
       style={{ transformBox: "view-box", originX: "18px", originY: "7.5px" }}
      />
      <m.path
       d="M7.612 12.524a3 3 0 1 0-1.6 4.3"
       variants={tailVariants}
       style={{ transformBox: "view-box", originX: "5px", originY: "14px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

RabbitIcon.displayName = "RabbitIcon";
export { RabbitIcon };
