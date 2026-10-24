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
export interface BanknoteArrowUpIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BanknoteArrowUpIconProps extends Omit<
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

const BanknoteArrowUpIcon = forwardRef<
 BanknoteArrowUpIconHandle,
 BanknoteArrowUpIconProps
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

  const coinVariants: Variants = {
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, 0.15, 1],
    transition: { duration: 0.55 * duration, ease: "easeInOut" },
   },
  };

  const dotVariants: Variants = {
   normal: { scale: 1 },
   animate: (i: number) => ({
    scale: [1, 1.7, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: (0.2 + i * 0.1) * duration,
    },
   }),
  };

  const arrowVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -1, 0.3, 0],
    transition: {
     duration: 0.6 * duration,
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
      <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
      <m.circle
       cx="12"
       cy="12"
       r="2"
       variants={coinVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path
       d="M6 12h.01"
       variants={dotVariants}
       custom={0}
       style={{ transformBox: "view-box", originX: "6px", originY: "12px" }}
      />
      <m.path
       d="M18 12h.01"
       variants={dotVariants}
       custom={1}
       style={{ transformBox: "view-box", originX: "18px", originY: "12px" }}
      />
      <m.g variants={arrowVariants}>
       <path d="M19 22v-6" />
       <path d="m22 19-3-3-3 3" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BanknoteArrowUpIcon.displayName = "BanknoteArrowUpIcon";
export { BanknoteArrowUpIcon };
