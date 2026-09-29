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
export interface BrainIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BrainIconProps extends Omit<
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

const BrainIcon = forwardRef<BrainIconHandle, BrainIconProps>(
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

  const brainVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.06, 0.97, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const thoughtVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.4, 1],
    transition: {
     duration: 0.5 * duration,
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
      <m.g
       variants={brainVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M12 18V5" />
       <m.path
        d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"
        variants={thoughtVariants}
        style={{ transformBox: "view-box", originX: "12px", originY: "11px" }}
       />
       <path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" />
       <path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" />
       <path d="M18 18a4 4 0 0 0 2-7.464" />
       <path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" />
       <path d="M6 18a4 4 0 0 1-2-7.464" />
       <path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BrainIcon.displayName = "BrainIcon";
export { BrainIcon };
