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
export interface UnlinkIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface UnlinkIconProps extends Omit<
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

const UnlinkIcon = forwardRef<UnlinkIconHandle, UnlinkIconProps>(
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

  const upperVariants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, 1, -0.3, 0],
    y: [0, -1, 0.3, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const lowerVariants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, -1, 0.3, 0],
    y: [0, 1, -0.3, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const sparkVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.4, 0.92, 1],
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
       d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"
       variants={upperVariants}
      />
      <m.path
       d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"
       variants={lowerVariants}
      />
      <m.line
       x1="8"
       x2="8"
       y1="2"
       y2="5"
       variants={sparkVariants(0.05)}
       style={{ transformBox: "view-box", originX: "8px", originY: "3.5px" }}
      />
      <m.line
       x1="2"
       x2="5"
       y1="8"
       y2="8"
       variants={sparkVariants(0.05)}
       style={{ transformBox: "view-box", originX: "3.5px", originY: "8px" }}
      />
      <m.line
       x1="16"
       x2="16"
       y1="19"
       y2="22"
       variants={sparkVariants(0.1)}
       style={{ transformBox: "view-box", originX: "16px", originY: "20.5px" }}
      />
      <m.line
       x1="19"
       x2="22"
       y1="16"
       y2="16"
       variants={sparkVariants(0.1)}
       style={{ transformBox: "view-box", originX: "20.5px", originY: "16px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

UnlinkIcon.displayName = "UnlinkIcon";
export { UnlinkIcon };
