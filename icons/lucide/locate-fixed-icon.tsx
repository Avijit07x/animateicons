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
export interface LocateFixedIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LocateFixedIconProps extends Omit<
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

const LocateFixedIcon = forwardRef<LocateFixedIconHandle, LocateFixedIconProps>(
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

  const tickVariants = (dx: number, dy: number): Variants => ({
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, dx, dx * -0.2, 0],
    y: [0, dy, dy * -0.2, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  });

  const ringVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.88, 1.03, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const dotVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.6, 1.15, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
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
      <m.line x1="2" x2="5" y1="12" y2="12" variants={tickVariants(1.5, 0)} />
      <m.line
       x1="19"
       x2="22"
       y1="12"
       y2="12"
       variants={tickVariants(-1.5, 0)}
      />
      <m.line x1="12" x2="12" y1="2" y2="5" variants={tickVariants(0, 1.5)} />
      <m.line
       x1="12"
       x2="12"
       y1="19"
       y2="22"
       variants={tickVariants(0, -1.5)}
      />
      <m.circle
       cx="12"
       cy="12"
       r="7"
       variants={ringVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <m.circle
       cx="12"
       cy="12"
       r="3"
       variants={dotVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

LocateFixedIcon.displayName = "LocateFixedIcon";
export { LocateFixedIcon };
