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
export interface LayoutListIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LayoutListIconProps extends Omit<
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

const LayoutListIcon = forwardRef<LayoutListIconHandle, LayoutListIconProps>(
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

  const lineVariants = (delay: number): Variants => ({
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, 0.5, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 1],
     delay: delay * duration,
    },
   },
  });

  const tileVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.85, 1.05, 1],
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
       d="M11.996 5H21.996"
       variants={lineVariants(0)}
       style={{ transformBox: "view-box", originX: "12px", originY: "5px" }}
      />
      <m.path
       d="M11.996 9H17.996"
       variants={lineVariants(0.06)}
       style={{ transformBox: "view-box", originX: "12px", originY: "9px" }}
      />
      <m.path
       d="M11.996 15H21.996"
       variants={lineVariants(0.15)}
       style={{ transformBox: "view-box", originX: "12px", originY: "15px" }}
      />
      <m.path
       d="M11.996 19H17.996"
       variants={lineVariants(0.21)}
       style={{ transformBox: "view-box", originX: "12px", originY: "19px" }}
      />
      <m.path
       d="M1.99603 7C1.99603 6.06812 1.99603 5.60218 2.14827 5.23463C2.35126 4.74458 2.74061 4.35523 3.23067 4.15224C3.59821 4 4.06415 4 4.99603 4C5.92792 4 6.39386 4 6.7614 4.15224C7.25146 4.35523 7.6408 4.74458 7.84379 5.23463C7.99603 5.60218 7.99603 6.06812 7.99603 7C7.99603 7.93188 7.99603 8.39782 7.84379 8.76537C7.6408 9.25542 7.25146 9.64477 6.7614 9.84776C6.39386 10 5.92792 10 4.99603 10C4.06415 10 3.59821 10 3.23067 9.84776C2.74061 9.64477 2.35126 9.25542 2.14827 8.76537C1.99603 8.39782 1.99603 7.93188 1.99603 7Z"
       variants={tileVariants(0)}
       style={{ transformBox: "view-box", originX: "5px", originY: "7px" }}
      />
      <m.path
       d="M1.99603 17C1.99603 16.0681 1.99603 15.6022 2.14827 15.2346C2.35126 14.7446 2.74061 14.3552 3.23067 14.1522C3.59821 14 4.06415 14 4.99603 14C5.92792 14 6.39386 14 6.7614 14.1522C7.25146 14.3552 7.6408 14.7446 7.84379 15.2346C7.99603 15.6022 7.99603 16.0681 7.99603 17C7.99603 17.9319 7.99603 18.3978 7.84379 18.7654C7.6408 19.2554 7.25146 19.6448 6.7614 19.8478C6.39386 20 5.92792 20 4.99603 20C4.06415 20 3.59821 20 3.23067 19.8478C2.74061 19.6448 2.35126 19.2554 2.14827 18.7654C1.99603 18.3978 1.99603 17.9319 1.99603 17Z"
       variants={tileVariants(0.15)}
       style={{ transformBox: "view-box", originX: "5px", originY: "17px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

LayoutListIcon.displayName = "LayoutListIcon";
export { LayoutListIcon };
