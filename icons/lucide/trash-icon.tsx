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
export interface TrashIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface TrashIconProps extends Omit<
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

const TrashIcon = forwardRef<TrashIconHandle, TrashIconProps>(
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

  const binVariants: Variants = {
   normal: { scaleY: 1, y: 0 },
   animate: {
    y: [0, 0, 1, 0],
    scaleY: [1, 1, 0.94, 1],
    transition: {
     duration: 0.9 * duration,
     times: [0, 0.55, 0.75, 1],
     ease: "easeOut",
    },
   },
  };

  const lidVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -24, -24, 0],
    transition: {
     duration: 0.9 * duration,
     times: [0, 0.2, 0.55, 1],
     ease: "easeInOut",
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
     >
      <m.path
       d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"
       variants={binVariants}
       initial="normal"
       animate={controls}
       style={{ transformBox: "view-box", originX: "12px", originY: "22px" }}
      />
      <m.g
       animate={controls}
       initial="normal"
       variants={lidVariants}
       style={{ transformBox: "view-box", originX: "3px", originY: "6px" }}
      >
       <m.path d="M3 6h18" />
       <m.path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

TrashIcon.displayName = "TrashIcon";
export { TrashIcon };
