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
export interface BugIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BugIconProps extends Omit<
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

const BugIcon = forwardRef<BugIconHandle, BugIconProps>(
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

  const bodyVariants: Variants = {
   normal: { rotate: 0, y: 0 },
   animate: {
    rotate: [0, -6, 6, -4, 0],
    y: [0, -0.8, 0, -0.8, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const legVariants: Variants = {
   normal: { rotate: 0 },
   animate: (dir: number) => ({
    rotate: [0, 16 * dir, -12 * dir, 10 * dir, -6 * dir, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
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
      <m.g
       variants={bodyVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "13px" }}
      >
       <path d="M12 20v-9" />
       <path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z" />
       <path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" />
       <m.path
        d="M14.12 3.88 16 2"
        variants={legVariants}
        custom={-1}
        style={{
         transformBox: "view-box",
         originX: "14.12px",
         originY: "3.88px",
        }}
       />
       <m.path
        d="m8 2 1.88 1.88"
        variants={legVariants}
        custom={1}
        style={{
         transformBox: "view-box",
         originX: "9.88px",
         originY: "3.88px",
        }}
       />
       <m.path
        d="M3 5a4 4 0 0 0 3.55 3.97"
        variants={legVariants}
        custom={1}
        style={{
         transformBox: "view-box",
         originX: "6.55px",
         originY: "8.97px",
        }}
       />
       <m.path
        d="M6 13H2"
        variants={legVariants}
        custom={-1}
        style={{ transformBox: "view-box", originX: "6px", originY: "13px" }}
       />
       <m.path
        d="M3 21a4 4 0 0 1 3.81-4"
        variants={legVariants}
        custom={1}
        style={{ transformBox: "view-box", originX: "6.81px", originY: "17px" }}
       />
       <m.path
        d="M21 5a4 4 0 0 1-3.55 3.97"
        variants={legVariants}
        custom={-1}
        style={{
         transformBox: "view-box",
         originX: "17.45px",
         originY: "8.97px",
        }}
       />
       <m.path
        d="M22 13h-4"
        variants={legVariants}
        custom={1}
        style={{ transformBox: "view-box", originX: "18px", originY: "13px" }}
       />
       <m.path
        d="M21 21a4 4 0 0 0-3.81-4"
        variants={legVariants}
        custom={-1}
        style={{
         transformBox: "view-box",
         originX: "17.19px",
         originY: "17px",
        }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BugIcon.displayName = "BugIcon";
export { BugIcon };
