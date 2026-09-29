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
export interface EyeClosedIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface EyeClosedIconProps extends Omit<
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

const EyeClosedIcon = forwardRef<EyeClosedIconHandle, EyeClosedIconProps>(
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

  const lidVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 1.15, 0.96, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const lashVariants = (angle: number, delay: number): Variants => ({
   normal: { rotate: 0 },
   animate: {
    rotate: [0, angle, -angle * 0.4, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
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
      <m.g
       variants={lidVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "8px" }}
      >
       <m.path
        d="m15 18-.722-3.25"
        variants={lashVariants(14, 0.12)}
        style={{
         transformBox: "view-box",
         originX: "14.278px",
         originY: "14.75px",
        }}
       />
       <path d="M2 8a10.645 10.645 0 0 0 20 0" />
       <m.path
        d="m20 15-1.726-2.05"
        variants={lashVariants(-14, 0.18)}
        style={{
         transformBox: "view-box",
         originX: "18.274px",
         originY: "12.95px",
        }}
       />
       <m.path
        d="m4 15 1.726-2.05"
        variants={lashVariants(14, 0)}
        style={{
         transformBox: "view-box",
         originX: "5.726px",
         originY: "12.95px",
        }}
       />
       <m.path
        d="m9 18 .722-3.25"
        variants={lashVariants(-14, 0.06)}
        style={{
         transformBox: "view-box",
         originX: "9.722px",
         originY: "14.75px",
        }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

EyeClosedIcon.displayName = "EyeClosedIcon";
export { EyeClosedIcon };
