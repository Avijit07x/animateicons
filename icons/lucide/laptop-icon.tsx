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

export interface LaptopIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LaptopIconProps extends Omit<
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

const LaptopIcon = forwardRef<LaptopIconHandle, LaptopIconProps>(
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
  const lidControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   lidControls.start("open");
  }, [lidControls, reduced]);

  const stop = useCallback(() => {
   lidControls.start("rest");
  }, [lidControls]);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: start,
    stopAnimation: stop,
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) start();
    else onMouseEnter?.(e as any);
   },
   [isAnimated, reduced, start, onMouseEnter],
  );

  const handleLeave = useCallback(
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) stop();
    else onMouseLeave?.(e);
   },
   [stop, onMouseLeave],
  );

  const hinge = {
   transformPerspective: 55,
   originX: "12px",
   originY: "15.526px",
  };

  const lidVariants: Variants = {
   rest: {
    rotateX: 0,
    ...hinge,
    transition: { duration: 0.5 * duration, ease: "easeOut" },
   },
   open: {
    rotateX: [72, -8, 3, 0],
    ...hinge,
    transition: {
     duration: 1.2 * duration,
     ease: [0.16, 1, 0.3, 1],
     times: [0, 0.6, 0.84, 1],
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
     <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
     >
      <m.path
       d="M4 15.526V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8.526"
       animate={lidControls}
       initial="rest"
       variants={lidVariants}
       style={{ transformBox: "view-box" }}
      />
      <path d="M20 15.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526" />
      <path d="M20.054 15.987H3.946" />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

LaptopIcon.displayName = "LaptopIcon";
export { LaptopIcon };
