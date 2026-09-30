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
export interface CalculatorIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CalculatorIconProps extends Omit<
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

const CalculatorIcon = forwardRef<CalculatorIconHandle, CalculatorIconProps>(
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

  const popVariants = (delay: number, peak = 1.35): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, peak, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeInOut",
     delay: delay * duration,
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
      <m.path
       d="M5.5 3V8M8 5.5L3 5.5"
       variants={popVariants(0, 1.4)}
       style={{ transformBox: "view-box", originX: "5.5px", originY: "5.5px" }}
      />
      <m.path
       d="M8 16L6 18M6 18L4 20M6 18L8 20M6 18L4 16"
       variants={popVariants(0.2, 1.4)}
       style={{ transformBox: "view-box", originX: "6px", originY: "18px" }}
      />
      <m.path
       d="M20 6L16 6"
       variants={popVariants(0.1, 1.4)}
       style={{ transformBox: "view-box", originX: "18px", originY: "6px" }}
      />
      <m.path
       d="M20 18.5L16 18.5M20 15.5L16 15.5"
       variants={popVariants(0.3, 1.4)}
       style={{ transformBox: "view-box", originX: "18px", originY: "17px" }}
      />
      <path d="M22 12L2 12" />
      <path d="M12 22L12 2" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CalculatorIcon.displayName = "CalculatorIcon";
export { CalculatorIcon };
