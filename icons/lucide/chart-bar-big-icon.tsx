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
export interface ChartBarBigIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ChartBarBigIconProps extends Omit<
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

const ChartBarBigIcon = forwardRef<ChartBarBigIconHandle, ChartBarBigIconProps>(
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

  const axisVariants: Variants = {
   normal: { pathLength: 1 },
   animate: {
    pathLength: [0, 1],
    transition: { duration: 0.4 * duration, ease: "easeOut" },
   },
  };

  const barVariants: Variants = {
   normal: { scaleX: 1 },
   animate: (i: number) => ({
    scaleX: [0, 1],
    transition: {
     delay: (0.3 + i * 0.14) * duration,
     duration: 0.5 * duration,
     ease: [0.34, 1.4, 0.64, 1],
    },
   }),
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
      <m.path d="M3 3v16a2 2 0 0 0 2 2h16" variants={axisVariants} />
      <m.rect
       x="7"
       y="13"
       width="9"
       height="4"
       rx="1"
       custom={0}
       variants={barVariants}
       style={{ transformBox: "view-box", originX: "7px", originY: "15px" }}
      />
      <m.rect
       x="7"
       y="5"
       width="12"
       height="4"
       rx="1"
       custom={1}
       variants={barVariants}
       style={{ transformBox: "view-box", originX: "7px", originY: "7px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ChartBarBigIcon.displayName = "ChartBarBigIcon";
export { ChartBarBigIcon };
