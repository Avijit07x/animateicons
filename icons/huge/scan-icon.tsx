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
export interface ScanIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ScanIconProps extends Omit<
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

const ScanIcon = forwardRef<ScanIconHandle, ScanIconProps>(
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

  const frameVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.93, 1.02, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const lineVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -4, 4, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     times: [0, 0.3, 0.7, 1],
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
       d="M16.0042 2.5C17.9974 2.61348 19.2576 2.93381 20.1619 3.83811C21.0662 4.74243 21.3865 6.00268 21.5 7.99598M7.99582 2.5C6.00261 2.61348 4.74241 2.93381 3.83812 3.83811C2.9338 4.74243 2.61347 6.00268 2.5 7.99598M21.5 16.004C21.3865 17.9973 21.0662 19.2576 20.1619 20.1619C19.2576 21.0662 17.9973 21.3865 16.004 21.5M2.5 16.004C2.61347 17.9973 2.9338 19.2576 3.83812 20.1619C4.74244 21.0662 6.00268 21.3865 7.99597 21.5"
       variants={frameVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.path d="M5 12H19" variants={lineVariants} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ScanIcon.displayName = "ScanIcon";
export { ScanIcon };
