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
export interface WaypointsIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface WaypointsIconProps extends Omit<
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

const WaypointsIcon = forwardRef<WaypointsIconHandle, WaypointsIconProps>(
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
   (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     controls.start("normal");
    } else {
     onMouseLeave?.(e as any);
    }
   },
   [controls, onMouseLeave],
  );

  const bodyVariants: Variants = {
   normal: { pathLength: 1, opacity: 1 },
   animate: (i: number) => ({
    pathLength: [0, 1],
    opacity: [0, 1],
    transition: {
     duration: 0.5 * duration,
     delay: i * 0.08 * duration,
     ease: [0.16, 1, 0.3, 1],
    },
   }),
  };

  const nodeVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: (i: number) => ({
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.35 * duration,
     delay: (0.35 + i * 0.16) * duration,
     times: [0, 0.6, 1],
     ease: [0.34, 1.4, 0.64, 1],
    },
   }),
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
       d="m10.586 5.414-5.172 5.172"
       custom={0}
       variants={bodyVariants}
      />
      <m.path d="M6 12h12" custom={0} variants={bodyVariants} />
      <m.path
       d="m18.586 13.414-5.172 5.172"
       custom={0}
       variants={bodyVariants}
      />
      <m.circle
       cx="12"
       cy="4"
       r="2"
       custom={0}
       variants={nodeVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "4px" }}
      />
      <m.circle
       cx="4"
       cy="12"
       r="2"
       custom={1}
       variants={nodeVariants}
       style={{ transformBox: "view-box", originX: "4px", originY: "12px" }}
      />
      <m.circle
       cx="20"
       cy="12"
       r="2"
       custom={2}
       variants={nodeVariants}
       style={{ transformBox: "view-box", originX: "20px", originY: "12px" }}
      />
      <m.circle
       cx="12"
       cy="20"
       r="2"
       custom={3}
       variants={nodeVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "20px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

WaypointsIcon.displayName = "WaypointsIcon";
export { WaypointsIcon };
