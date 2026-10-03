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
export interface GooglePhotosIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GooglePhotosIconProps extends Omit<
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

const GooglePhotosIcon = forwardRef<
 GooglePhotosIconHandle,
 GooglePhotosIconProps
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

  const spinVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, 90],
    scale: [1, 0.88, 1],
    transition: { duration: 0.6 * duration, ease: "easeInOut" },
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
       variants={spinVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M12 12C14.7614 12 17 9.74267 17 6.95811C17 4.87018 15.7414 3.07868 13.9475 2.31298C13.246 2.01357 12.8953 1.86387 12.4476 2.16297C12 2.46206 12 2.95237 12 3.93298V12Z" />
       <path d="M12 12C9.23858 12 7 14.2573 7 17.0419C7 19.1298 8.25861 20.9213 10.0525 21.687C10.754 21.9864 11.1047 22.1361 11.5524 21.837C12 21.5379 12 21.0476 12 20.067V12Z" />
       <path d="M12 12C12 14.7614 14.2573 17 17.0419 17C19.1298 17 20.9213 15.7414 21.687 13.9475C21.9864 13.246 22.1361 12.8953 21.837 12.4476C21.5379 12 21.0476 12 20.067 12L12 12Z" />
       <path d="M12 12C12 9.23858 9.74267 7 6.95811 7C4.87018 7 3.07868 8.25861 2.31298 10.0525C2.01357 10.754 1.86387 11.1047 2.16297 11.5524C2.46206 12 2.95237 12 3.93298 12H12Z" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

GooglePhotosIcon.displayName = "GooglePhotosIcon";
export { GooglePhotosIcon };
