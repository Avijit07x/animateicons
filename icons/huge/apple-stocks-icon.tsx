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
export interface AppleStocksIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface AppleStocksIconProps extends Omit<
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

const AppleStocksIcon = forwardRef<AppleStocksIconHandle, AppleStocksIconProps>(
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

  const dotVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.9, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeInOut",
     delay: 0.45 * duration,
    },
   },
  };

  const drawVariants = (
   length: number,
   delay: number,
   dur = 0.35,
  ): Variants => ({
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [length, 0],
    transition: {
     duration: dur * duration,
     ease: "easeInOut",
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
      <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" />
      <m.path
       d="M2.5 14.5H3.03875C3.51106 14.5 3.74721 14.5 3.95256 14.4013C4.15791 14.3026 4.30544 14.1182 4.60049 13.7494L6 12L7.5 14.5L9 11L11.5 16L15 9L17 12.5L18.5 11L19.9453 13.168C20.1973 13.546 20.3233 13.735 20.5074 13.8494C20.544 13.8721 20.582 13.8925 20.6212 13.9103C20.8185 14 21.0457 14 21.5 14"
       strokeDasharray="36"
       strokeDashoffset="0"
       variants={drawVariants(36, 0.05, 0.55)}
      />
      <path d="M15 2.5V5.5M15 21.5V14.5" />
      <m.circle
       cx="15"
       cy="9"
       r="1"
       variants={dotVariants}
       style={{ transformBox: "view-box", originX: "15px", originY: "9px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

AppleStocksIcon.displayName = "AppleStocksIcon";
export { AppleStocksIcon };
