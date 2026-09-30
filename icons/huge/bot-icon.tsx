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

  const eyesVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.1, 1, 0.1, 1],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const antennaVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -16, 12, -7, 0],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const leftEarVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, -1.5, 0],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  const rightEarVariants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, 1.5, 0],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
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
      <path d="M13 7H11C8.19108 7 6.78661 7 5.77772 7.67412C5.34096 7.96596 4.96596 8.34096 4.67412 8.77772C4 9.78661 4 11.1911 4 14C4 16.8089 4 18.2134 4.67412 19.2223C4.96596 19.659 5.34096 20.034 5.77772 20.3259C6.78661 21 8.19108 21 11 21H13C15.8089 21 17.2134 21 18.2223 20.3259C18.659 20.034 19.034 19.659 19.3259 19.2223C20 18.2134 20 16.8089 20 14C20 11.1911 20 9.78661 19.3259 8.77772C19.034 8.34096 18.659 7.96596 18.2223 7.67412C17.2134 7 15.8089 7 13 7Z" />
      <path d="M10 17H14" />
      <m.path d="M4 14H2" variants={leftEarVariants} />
      <m.path d="M22 14H20" variants={rightEarVariants} />
      <m.g
       variants={eyesVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M15 11V13" />
       <path d="M9 11V13" />
      </m.g>
      <m.path
       d="M12 7C12 5.11438 12 4.17157 11.4142 3.58579C10.8284 3 9.88562 3 8 3"
       variants={antennaVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "7px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

BotIcon.displayName = "BotIcon";
export { BotIcon };
