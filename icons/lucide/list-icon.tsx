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
export interface ListIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ListIconProps extends Omit<
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

const ListIcon = forwardRef<ListIconHandle, ListIconProps>(
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

  const rowVariants = (delay: number): Variants => ({
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, 0.55, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

  const dotVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.7, 1],
    transition: {
     duration: 0.4 * duration,
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
       d="M3 5h.01"
       variants={dotVariants(0)}
       style={{ transformBox: "view-box", originX: "3px", originY: "5px" }}
      />
      <m.path
       d="M3 12h.01"
       variants={dotVariants(0.12)}
       style={{ transformBox: "view-box", originX: "3px", originY: "12px" }}
      />
      <m.path
       d="M3 19h.01"
       variants={dotVariants(0.24)}
       style={{ transformBox: "view-box", originX: "3px", originY: "19px" }}
      />
      <m.path
       d="M8 5h13"
       variants={rowVariants(0.05)}
       style={{ transformBox: "view-box", originX: "8px", originY: "5px" }}
      />
      <m.path
       d="M8 12h13"
       variants={rowVariants(0.17)}
       style={{ transformBox: "view-box", originX: "8px", originY: "12px" }}
      />
      <m.path
       d="M8 19h13"
       variants={rowVariants(0.29)}
       style={{ transformBox: "view-box", originX: "8px", originY: "19px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ListIcon.displayName = "ListIcon";
export { ListIcon };
