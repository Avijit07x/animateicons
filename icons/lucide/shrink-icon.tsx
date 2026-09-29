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
export interface ShrinkIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ShrinkIconProps extends Omit<
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

const ShrinkIcon = forwardRef<ShrinkIconHandle, ShrinkIconProps>(
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

  const cornerVariants = (dx: number, dy: number): Variants => ({
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, 1.5 * dx, -0.5 * dx, 0],
    y: [0, 1.5 * dy, -0.5 * dy, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.3, 0.7, 1],
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
      <m.path d="M9 4.2V9m0 0H4.2M9 9 3 3" variants={cornerVariants(1, 1)} />
      <m.path d="M15 4.2V9m0 0h4.8M15 9l6-6" variants={cornerVariants(-1, 1)} />
      <m.path
       d="M9 19.8V15m0 0H4.2M9 15l-6 6"
       variants={cornerVariants(1, -1)}
      />
      <m.path
       d="m15 15 6 6m-6-6v4.8m0-4.8h4.8"
       variants={cornerVariants(-1, -1)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ShrinkIcon.displayName = "ShrinkIcon";
export { ShrinkIcon };
