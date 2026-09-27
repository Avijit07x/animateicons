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
export interface PictureInPictureIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PictureInPictureIconProps extends Omit<
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

const PictureInPictureIcon = forwardRef<
 PictureInPictureIconHandle,
 PictureInPictureIconProps
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

  const miniVariants: Variants = {
   normal: { x: 0, y: 0, scale: 1, opacity: 1 },
   animate: {
    x: [-4, 0.5, 0],
    y: [-3, 0.4, 0],
    scale: [0.6, 1.05, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.55 * duration,
     ease: "easeOut",
     times: [0, 0.7, 1],
    },
   },
  };

  const arrowVariants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, -1, 0],
    y: [0, -1, 0],
    transition: { duration: 0.45 * duration, ease: "easeInOut" },
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
      <m.g variants={arrowVariants}>
       <path d="M2 10h6V4" />
       <path d="m2 4 6 6" />
      </m.g>
      <path d="M21 10V7a2 2 0 0 0-2-2h-7" />
      <path d="M3 14v2a2 2 0 0 0 2 2h3" />
      <m.rect
       x="12"
       y="14"
       width="10"
       height="7"
       rx="1"
       variants={miniVariants}
       style={{ transformBox: "view-box", originX: "17px", originY: "17.5px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PictureInPictureIcon.displayName = "PictureInPictureIcon";
export { PictureInPictureIcon };
