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
export interface NotebookPenIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface NotebookPenIconProps extends Omit<
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

const NotebookPenIcon = forwardRef<NotebookPenIconHandle, NotebookPenIconProps>(
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

  const penVariants: Variants = {
   normal: { x: 0, y: 0, rotate: 0 },
   animate: {
    x: [0, -1.5, 1, -1, 0],
    y: [0, 1, -0.5, 0.8, 0],
    rotate: [0, -8, 4, -4, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const ringVariants: Variants = {
   normal: { scaleX: 1 },
   animate: (i: number) => ({
    scaleX: [1, 0.3, 1],
    transition: {
     duration: 0.3 * duration,
     ease: "easeInOut",
     delay: i * 0.08 * duration,
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
      <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
      <m.path
       d="M2 6h4"
       variants={ringVariants}
       custom={0}
       style={{ transformBox: "view-box", originX: "4px", originY: "6px" }}
      />
      <m.path
       d="M2 10h4"
       variants={ringVariants}
       custom={1}
       style={{ transformBox: "view-box", originX: "4px", originY: "10px" }}
      />
      <m.path
       d="M2 14h4"
       variants={ringVariants}
       custom={2}
       style={{ transformBox: "view-box", originX: "4px", originY: "14px" }}
      />
      <m.path
       d="M2 18h4"
       variants={ringVariants}
       custom={3}
       style={{ transformBox: "view-box", originX: "4px", originY: "18px" }}
      />
      <m.path
       d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
       variants={penVariants}
       style={{ transformBox: "view-box", originX: "13px", originY: "11px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

NotebookPenIcon.displayName = "NotebookPenIcon";
export { NotebookPenIcon };
