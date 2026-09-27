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
export interface GripVerticalIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GripVerticalIconProps extends Omit<
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

const GripVerticalIcon = forwardRef<
 GripVerticalIconHandle,
 GripVerticalIconProps
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

  const gripVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -1.5, 1, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const dotVariants: Variants = {
   normal: { scale: 1 },
   animate: (delay: number) => ({
    scale: [1, 1.3, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeInOut",
     delay: delay * duration,
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
      <m.g variants={gripVariants}>
       <m.circle
        cx="9"
        cy="12"
        r="1"
        variants={dotVariants}
        custom={0.1}
        style={{ transformBox: "view-box", originX: "9px", originY: "12px" }}
       />
       <m.circle
        cx="9"
        cy="5"
        r="1"
        variants={dotVariants}
        custom={0}
        style={{ transformBox: "view-box", originX: "9px", originY: "5px" }}
       />
       <m.circle
        cx="9"
        cy="19"
        r="1"
        variants={dotVariants}
        custom={0.2}
        style={{ transformBox: "view-box", originX: "9px", originY: "19px" }}
       />
       <m.circle
        cx="15"
        cy="12"
        r="1"
        variants={dotVariants}
        custom={0.15}
        style={{ transformBox: "view-box", originX: "15px", originY: "12px" }}
       />
       <m.circle
        cx="15"
        cy="5"
        r="1"
        variants={dotVariants}
        custom={0.05}
        style={{ transformBox: "view-box", originX: "15px", originY: "5px" }}
       />
       <m.circle
        cx="15"
        cy="19"
        r="1"
        variants={dotVariants}
        custom={0.25}
        style={{ transformBox: "view-box", originX: "15px", originY: "19px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

GripVerticalIcon.displayName = "GripVerticalIcon";
export { GripVerticalIcon };
