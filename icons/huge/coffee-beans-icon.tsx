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
export interface CoffeeBeansIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CoffeeBeansIconProps extends Omit<
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

const CoffeeBeansIcon = forwardRef<CoffeeBeansIconHandle, CoffeeBeansIconProps>(
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

  const tileVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.85, 1.06, 1],
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
      <m.path
       d="M13 5.64868C10.158 2.80666 6.20842 2.1484 4.17841 4.17841M4.17841 4.17841C2.1484 6.20842 2.80666 10.158 5.64868 13M4.17841 4.17841C4.42346 5.40363 5.72249 8.07432 8.95707 8.95647"
       variants={tileVariants(0)}
       style={{
        transformBox: "view-box",
        originX: "7.57px",
        originY: "7.57px",
       }}
      />
      <m.path
       d="M9.21114 19.7889C11.2975 21.8753 15.3568 21.1987 18.2778 18.2778C21.1987 15.3568 21.8753 11.2975 19.7889 9.21114M9.21114 19.7889C7.12475 17.7025 7.80129 13.6432 10.7222 10.7222C13.6432 7.80129 17.7025 7.12475 19.7889 9.21114M9.21114 19.7889C10.7222 19.2852 13.5829 18.8717 14.8781 14.1225C15.7847 10.7981 18.5296 9.46299 19.7889 9.21114"
       variants={tileVariants(0.15)}
       style={{
        transformBox: "view-box",
        originX: "14.5px",
        originY: "14.5px",
       }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CoffeeBeansIcon.displayName = "CoffeeBeansIcon";
export { CoffeeBeansIcon };
