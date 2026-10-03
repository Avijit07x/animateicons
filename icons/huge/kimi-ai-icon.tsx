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
export interface KimiAiIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface KimiAiIconProps extends Omit<
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

const KimiAiIcon = forwardRef<KimiAiIconHandle, KimiAiIconProps>(
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
   normal: { y: 0 },
   animate: {
    y: [0, -2.5, 0.5, 0],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
     delay: 0.4 * duration,
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
      <m.path
       d="M19.5 4.5H20.5M21 4.5C21 5.05228 20.5523 5.5 20 5.5H19V4.5C19 3.94772 19.4477 3.5 20 3.5C20.5523 3.5 21 3.94772 21 4.5Z"
       variants={dotVariants}
      />
      <m.path
       d="M5.5 6H3V20.5H5.5V17L7.75574 14.7443L13.8256 19.5669C14.586 20.1711 15.5287 20.5 16.5 20.5V17.5C15.8521 17.5 15.2228 17.283 14.7126 16.8836L9.61064 12.8894L16.5 6H13L5.5 13.5V6Z"
       strokeDasharray="80"
       strokeDashoffset="0"
       variants={drawVariants(80, 0, 0.5)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

KimiAiIcon.displayName = "KimiAiIcon";
export { KimiAiIcon };
