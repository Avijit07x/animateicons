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
export interface ListCollapseIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ListCollapseIconProps extends Omit<
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

const ListCollapseIcon = forwardRef<
 ListCollapseIconHandle,
 ListCollapseIconProps
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

  const chevronVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, 90, 90, 0],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.3, 0.6, 1],
    },
   },
  };

  const rowVariants: Variants = {
   normal: { scaleX: 1, opacity: 1 },
   animate: {
    scaleX: [1, 0.2, 0.2, 1],
    opacity: [1, 0.3, 0.3, 1],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.3, 0.6, 1],
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
      <path d="M10 5h11" />
      <m.path
       d="M10 12h11"
       variants={rowVariants}
       style={{ transformBox: "view-box", originX: "10px", originY: "12px" }}
      />
      <path d="M10 19h11" />
      <m.path
       d="m3 10 3-3-3-3"
       variants={chevronVariants}
       style={{ transformBox: "view-box", originX: "4.5px", originY: "7px" }}
      />
      <m.path
       d="m3 20 3-3-3-3"
       variants={chevronVariants}
       style={{ transformBox: "view-box", originX: "4.5px", originY: "17px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ListCollapseIcon.displayName = "ListCollapseIcon";
export { ListCollapseIcon };
