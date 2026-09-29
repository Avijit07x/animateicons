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
export interface BotIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BotIconProps extends Omit<
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

const BotIcon = forwardRef<BotIconHandle, BotIconProps>(
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

  const headVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -1.5, 0, -0.75, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const antennaVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -16, 12, -6, 0],
    transition: { duration: 0.8 * duration, ease: "easeInOut" },
   },
  };

  const eyeVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.1, 0.1, 1],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.33, 0.67, 1],
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
      <m.g variants={headVariants}>
       <m.path
        d="M12 8V4H8"
        variants={antennaVariants}
        style={{ transformBox: "view-box", originX: "12px", originY: "8px" }}
       />
       <rect width="16" height="12" x="4" y="8" rx="2" />
       <path d="M2 14h2" />
       <path d="M20 14h2" />
       <m.path
        d="M15 13v2"
        variants={eyeVariants}
        style={{ transformBox: "view-box", originX: "15px", originY: "14px" }}
       />
       <m.path
        d="M9 13v2"
        variants={eyeVariants}
        style={{ transformBox: "view-box", originX: "9px", originY: "14px" }}
       />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BotIcon.displayName = "BotIcon";
export { BotIcon };
