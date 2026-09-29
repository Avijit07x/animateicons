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

  const keyVariants = (i: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.8, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeInOut",
     delay: (0.15 + i * 0.06) * duration,
    },
   },
  });

  const displayVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [9, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: { duration: 0.4 * duration, ease: "easeOut" },
     opacity: { duration: 0.25 * duration, ease: "easeOut" },
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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={controls}
      initial="normal"
     >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <m.line
       x1="8"
       x2="16"
       y1="6"
       y2="6"
       strokeDasharray="9"
       strokeDashoffset="0"
       variants={displayVariants}
      />
      <line x1="16" x2="16" y1="14" y2="18" />
      <m.path
       d="M16 10h.01"
       variants={keyVariants(0)}
       style={{ transformBox: "view-box", originX: "16px", originY: "10px" }}
      />
      <m.path
       d="M12 10h.01"
       variants={keyVariants(1)}
       style={{ transformBox: "view-box", originX: "12px", originY: "10px" }}
      />
      <m.path
       d="M8 10h.01"
       variants={keyVariants(2)}
       style={{ transformBox: "view-box", originX: "8px", originY: "10px" }}
      />
      <m.path
       d="M12 14h.01"
       variants={keyVariants(3)}
       style={{ transformBox: "view-box", originX: "12px", originY: "14px" }}
      />
      <m.path
       d="M8 14h.01"
       variants={keyVariants(4)}
       style={{ transformBox: "view-box", originX: "8px", originY: "14px" }}
      />
      <m.path
       d="M12 18h.01"
       variants={keyVariants(5)}
       style={{ transformBox: "view-box", originX: "12px", originY: "18px" }}
      />
      <m.path
       d="M8 18h.01"
       variants={keyVariants(6)}
       style={{ transformBox: "view-box", originX: "8px", originY: "18px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CalculatorIcon.displayName = "CalculatorIcon";
export { CalculatorIcon };
