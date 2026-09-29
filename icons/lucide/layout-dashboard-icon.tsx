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
export interface LayoutDashboardIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LayoutDashboardIconProps extends Omit<
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

const LayoutDashboardIcon = forwardRef<
 LayoutDashboardIconHandle,
 LayoutDashboardIconProps
>(
 (
  {
   onMouseEnter,
   onMouseLeave,
   className,
   size = 24,
   duration = 0.6,
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

  const tileVariants: Variants = {
   normal: { scale: 1 },
   animate: (i: number) => ({
    scale: [1, 0.78, 1.1, 1],
    transition: {
     duration: 0.85 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.75, 1],
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
      <m.rect
       width="7"
       height="9"
       x="3"
       y="3"
       rx="1"
       variants={tileVariants}
       custom={0}
       style={{ transformBox: "fill-box", originX: "50%", originY: "50%" }}
      />
      <m.rect
       width="7"
       height="5"
       x="14"
       y="3"
       rx="1"
       variants={tileVariants}
       custom={1}
       style={{ transformBox: "fill-box", originX: "50%", originY: "50%" }}
      />
      <m.rect
       width="7"
       height="9"
       x="14"
       y="12"
       rx="1"
       variants={tileVariants}
       custom={2}
       style={{ transformBox: "fill-box", originX: "50%", originY: "50%" }}
      />
      <m.rect
       width="7"
       height="5"
       x="3"
       y="16"
       rx="1"
       variants={tileVariants}
       custom={3}
       style={{ transformBox: "fill-box", originX: "50%", originY: "50%" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

LayoutDashboardIcon.displayName = "LayoutDashboardIcon";
export { LayoutDashboardIcon };
