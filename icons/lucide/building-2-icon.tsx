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
export interface Building2IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Building2IconProps extends Omit<
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

const Building2Icon = forwardRef<Building2IconHandle, Building2IconProps>(
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

  const buildingVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.92, 1.03, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const windowVariants: Variants = {
   normal: { scaleX: 1, opacity: 1 },
   animate: (i: number) => ({
    scaleX: [1, 0, 1],
    opacity: [1, 0, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeInOut",
     delay: (0.15 + i * 0.15) * duration,
    },
   }),
  };
  const doorVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: {
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeOut",
     delay: 0.45 * duration,
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
      <m.g
       variants={buildingVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "21px" }}
      >
       <m.path
        d="M10 12h4"
        variants={windowVariants}
        custom={0}
        style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
       />
       <m.path
        d="M10 8h4"
        variants={windowVariants}
        custom={1}
        style={{ transformBox: "view-box", originX: "12px", originY: "8px" }}
       />
       <m.path d="M14 21v-3a2 2 0 0 0-4 0v3" variants={doorVariants} />
       <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
       <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Building2Icon.displayName = "Building2Icon";
export { Building2Icon };
