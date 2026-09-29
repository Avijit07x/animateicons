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
export interface GitPullRequestIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GitPullRequestIconProps extends Omit<
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

const GitPullRequestIcon = forwardRef<
 GitPullRequestIconHandle,
 GitPullRequestIconProps
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

  const popVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.35, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

  const lineVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [9, 0],
    opacity: [0.3, 1],
    transition: { duration: 0.4 * duration, ease: "easeInOut" },
   },
  };

  const arrowVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, -1.5, 0.4, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     delay: 0.2 * duration,
     times: [0, 0.4, 0.75, 1],
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
       d="M6 8L6 16"
       strokeDasharray="9"
       strokeDashoffset="0"
       variants={lineVariants}
      />
      <m.path
       d="M18 16V12C18 9.17156 18 7.75735 17.1213 6.87867C16.2426 5.99999 14.8284 5.99999 12 5.99999L11 5.99999M11 5.99999C11 5.29976 12.9943 3.99152 13.5 3.49999M11 5.99999C11 6.70022 12.9943 8.00846 13.5 8.49999"
       variants={arrowVariants}
      />
      <m.circle
       cx="6"
       cy="18"
       r="2"
       variants={popVariants(0.2)}
       style={{ transformBox: "view-box", originX: "6px", originY: "18px" }}
      />
      <m.circle
       cx="6"
       cy="6"
       r="2"
       variants={popVariants(0)}
       style={{ transformBox: "view-box", originX: "6px", originY: "6px" }}
      />
      <m.circle
       cx="18"
       cy="18"
       r="2"
       variants={popVariants(0.35)}
       style={{ transformBox: "view-box", originX: "18px", originY: "18px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

GitPullRequestIcon.displayName = "GitPullRequestIcon";
export { GitPullRequestIcon };
