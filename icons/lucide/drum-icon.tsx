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
export interface DrumIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface DrumIconProps extends Omit<
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

const DrumIcon = forwardRef<DrumIconHandle, DrumIconProps>(
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

  const leftStickVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -14, 7, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.7, 1],
    },
   },
  };

  const rightStickVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, 14, -7, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.7, 1],
     delay: 0.18 * duration,
    },
   },
  };

  const skinVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.86, 1, 0.86, 1],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     times: [0, 0.5, 0.63, 0.76, 1],
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
      <m.path
       d="m2 2 8 8"
       variants={leftStickVariants}
       style={{ transformBox: "view-box", originX: "2px", originY: "2px" }}
      />
      <m.path
       d="m22 2-8 8"
       variants={rightStickVariants}
       style={{ transformBox: "view-box", originX: "22px", originY: "2px" }}
      />
      <m.ellipse
       cx="12"
       cy="9"
       rx="10"
       ry="5"
       variants={skinVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "9px" }}
      />
      <path d="M7 13.4v7.9" />
      <path d="M12 14v8" />
      <path d="M17 13.4v7.9" />
      <path d="M2 9v8a10 5 0 0 0 20 0V9" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

DrumIcon.displayName = "DrumIcon";
export { DrumIcon };
