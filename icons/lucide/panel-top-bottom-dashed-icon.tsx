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
export interface PanelTopBottomDashedIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PanelTopBottomDashedIconProps extends Omit<
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

const PanelTopBottomDashedIcon = forwardRef<
 PanelTopBottomDashedIconHandle,
 PanelTopBottomDashedIconProps
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

  const dividerVariants: Variants = {
   normal: { y: 0 },
   animate: (sign: number) => ({
    y: [0, 4 * sign, -1 * sign, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.45, 0.8, 1],
    },
   }),
  };

  const dashVariants: Variants = {
   normal: { opacity: 1 },
   animate: (i: number) => ({
    opacity: [1, 0.2, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: i * 0.05 * duration,
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
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <m.g variants={dividerVariants} custom={-1}>
       <m.path d="M3 9h2" variants={dashVariants} custom={0} />
       <m.path d="M9 9h1" variants={dashVariants} custom={1} />
       <m.path d="M14 9h1" variants={dashVariants} custom={2} />
       <m.path d="M19 9h2" variants={dashVariants} custom={3} />
      </m.g>
      <m.g variants={dividerVariants} custom={1}>
       <m.path d="M3 15h2" variants={dashVariants} custom={0} />
       <m.path d="M9 15h1" variants={dashVariants} custom={1} />
       <m.path d="M14 15h1" variants={dashVariants} custom={2} />
       <m.path d="M19 15h2" variants={dashVariants} custom={3} />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PanelTopBottomDashedIcon.displayName = "PanelTopBottomDashedIcon";
export { PanelTopBottomDashedIcon };
