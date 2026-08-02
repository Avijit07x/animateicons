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
export interface BellDotIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BellDotIconProps extends Omit<
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

const BellDotIcon = forwardRef<BellDotIconHandle, BellDotIconProps>(
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

  const bellVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, 7, -18, 14, -9, 5, -2, 0],
    transition: {
     duration: 1.3 * duration,
     ease: "easeInOut",
     times: [0, 0.09, 0.26, 0.45, 0.62, 0.78, 0.9, 1],
    },
   },
  };

  const clapperVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, 1.5, -5, 4, -2.5, 1.5, -1, 0],
    transition: {
     duration: 1.3 * duration,
     ease: "easeInOut",
     times: [0, 0.09, 0.26, 0.45, 0.62, 0.78, 0.9, 1],
     delay: 0.05 * duration,
    },
   },
  };

  const dotVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: {
    scale: [0.4, 1.25, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.5 * duration,
     delay: 0.12 * duration,
     times: [0, 0.6, 1],
     ease: [0.34, 1.4, 0.64, 1],
    },
   },
  };

  return (
   <LazyMotion features={domMin} strict>
    <m.div
     className={cn("relative inline-flex", className)}
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
      variants={bellVariants}
      style={{ transformOrigin: "top center" }}
     >
      <m.path d="M10.268 21a2 2 0 0 0 3.464 0" variants={clapperVariants} />
      <path d="M11.68 2.009A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673c-.824-.85-1.678-1.731-2.21-3.348" />
      <m.circle
       cx="18"
       cy="5"
       r="3"
       variants={dotVariants}
       style={{ transformBox: "view-box", originX: "18px", originY: "5px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BellDotIcon.displayName = "BellDotIcon";
export { BellDotIcon };
