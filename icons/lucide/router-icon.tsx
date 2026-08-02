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
export interface RouterIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface RouterIconProps extends Omit<
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

const RouterIcon = forwardRef<RouterIconHandle, RouterIconProps>(
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

  const bodyVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: (i: number) => ({
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.5 * duration,
     delay: i * 0.08 * duration,
     ease: [0.16, 1, 0.3, 1],
    },
   }),
  };

  const popVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: (i: number) => ({
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.38 * duration,
     delay: (0.45 + i * 0.08) * duration,
     times: [0, 0.6, 1],
     ease: [0.34, 1.4, 0.64, 1],
    },
   }),
  };

  const signalVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: (i: number) => ({
    scale: [0.4, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.4 * duration,
     delay: (0.35 + i * 0.14) * duration,
     ease: [0.34, 1.2, 0.64, 1],
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
      <m.rect
       width="20"
       height="8"
       x="2"
       y="14"
       rx="2"
       custom={0}
       variants={bodyVariants}
      />
      <m.path d="M15 10v4" custom={1} variants={bodyVariants} />
      <m.path
       d="M17.84 7.17a4 4 0 0 0-5.66 0"
       custom={0}
       variants={signalVariants}
       style={{ transformBox: "view-box", originX: "15px", originY: "10px" }}
      />
      <m.path
       d="M20.66 4.34a8 8 0 0 0-11.31 0"
       custom={1}
       variants={signalVariants}
       style={{ transformBox: "view-box", originX: "15px", originY: "10px" }}
      />
      <m.path
       d="M6.01 18H6"
       custom={0}
       variants={popVariants}
       style={{ transformBox: "view-box", originX: "6px", originY: "18px" }}
      />
      <m.path
       d="M10.01 18H10"
       custom={1}
       variants={popVariants}
       style={{ transformBox: "view-box", originX: "10px", originY: "18px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

RouterIcon.displayName = "RouterIcon";
export { RouterIcon };
