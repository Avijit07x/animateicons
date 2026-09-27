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
export interface ShapesIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ShapesIconProps extends Omit<
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

const ShapesIcon = forwardRef<ShapesIconHandle, ShapesIconProps>(
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

  const shapeVariants: Variants = {
   normal: { scale: 1 },
   animate: (i: number) => ({
    scale: [1, 0, 1.15, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeOut",
     times: [0, 0.2, 0.7, 1],
     delay: i * 0.12 * duration,
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
      <m.path
       d="M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"
       variants={shapeVariants}
       custom={0}
       style={{ transformBox: "view-box", originX: "12px", originY: "6.5px" }}
      />
      <m.rect
       x="3"
       y="14"
       width="7"
       height="7"
       rx="1"
       variants={shapeVariants}
       custom={1}
       style={{ transformBox: "view-box", originX: "6.5px", originY: "17.5px" }}
      />
      <m.circle
       cx="17.5"
       cy="17.5"
       r="3.5"
       variants={shapeVariants}
       custom={2}
       style={{
        transformBox: "view-box",
        originX: "17.5px",
        originY: "17.5px",
       }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ShapesIcon.displayName = "ShapesIcon";
export { ShapesIcon };
