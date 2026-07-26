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

export interface PencilIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PencilIconProps extends Omit<
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

const PencilIcon = forwardRef<PencilIconHandle, PencilIconProps>(
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
  const writeControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   writeControls.start("write");
  }, [writeControls, reduced]);

  const stop = useCallback(() => {
   writeControls.start("rest");
  }, [writeControls]);

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

  const writeVariants: Variants = {
   rest: {
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 0.28 * duration, ease: "easeOut" },
   },
   write: {
    x: [0, 0.5, -0.55, 0.46, -0.5, 0.42, -0.32, 0],
    y: [0, 0.22, -0.24, 0.2, -0.22, 0.18, -0.14, 0],
    rotate: [0, 1.35, -1.45, 1.25, -1.3, 1.1, -0.75, 0],
    transition: {
     duration: 1.15 * duration,
     ease: "easeInOut",
     times: [0, 0.14, 0.3, 0.44, 0.58, 0.72, 0.86, 1],
     repeat: Infinity,
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
      <m.g
       animate={writeControls}
       initial="rest"
       variants={writeVariants}
       style={{
        transformBox: "view-box",
        originX: "2.15px",
        originY: "21.85px",
       }}
      >
       <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
       <path d="m15 5 4 4" />
      </m.g>
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PencilIcon.displayName = "PencilIcon";
export { PencilIcon };
