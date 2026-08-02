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
export interface AlarmClockIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface AlarmClockIconProps extends Omit<
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

const AlarmClockIcon = forwardRef<AlarmClockIconHandle, AlarmClockIconProps>(
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
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     controls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [controls, onMouseLeave],
  );

  const clockVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -8, 8, -6.5, 5, -3.5, 2, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     times: [0, 0.14, 0.3, 0.46, 0.62, 0.76, 0.88, 1],
    },
   },
  };

  const handsVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -9, 7, -4, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     times: [0, 0.2, 0.45, 0.7, 1],
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
      variants={clockVariants}
      style={{ transformOrigin: "center" }}
     >
      <circle cx="12" cy="13" r="8" />
      <m.path
       d="M12 9v4l2 2"
       variants={handsVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "13px" }}
      />
      <path d="M5 3 2 6" />
      <path d="m22 6-3-3" />
      <path d="M6.38 18.7 4 21" />
      <path d="M17.64 18.67 20 21" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

AlarmClockIcon.displayName = "AlarmClockIcon";
export { AlarmClockIcon };
