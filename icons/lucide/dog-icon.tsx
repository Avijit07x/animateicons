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
export interface DogIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface DogIconProps extends Omit<
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

const DogIcon = forwardRef<DogIconHandle, DogIconProps>(
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

  const leftEarVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, 18, -6, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
    },
   },
  };

  const rightEarVariants: Variants = {
   normal: { rotate: 0 },
   animate: {
    rotate: [0, -18, 6, 0],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
     delay: 0.1 * duration,
    },
   },
  };

  const blinkVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.1, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeInOut",
     delay: 0.35 * duration,
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
      <path d="M11.25 16.25h1.5L12 17z" />
      <m.path
       d="M16 14v.5"
       variants={blinkVariants}
       style={{ transformBox: "view-box", originX: "16px", originY: "14.25px" }}
      />
      <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" />
      <m.path
       d="M8 14v.5"
       variants={blinkVariants}
       style={{ transformBox: "view-box", originX: "8px", originY: "14.25px" }}
      />
      <m.path
       d="M8.5 8.5C8.116 9.55 7.417 10.528 6.156 11C4.225 11.722 2.58 10.703 2.5 10C2.387 9.006 3.677 3.47 6.5 3C8.423 2.679 10.151 3.845 10.151 5.235"
       variants={leftEarVariants}
       style={{
        transformBox: "view-box",
        originX: "10.151px",
        originY: "5.235px",
       }}
      />
      <path d="M10.151 5.235A7.497 7.497 0 0 1 14 5.277" />
      <m.path
       d="M14 5.277C14 3.887 15.844 2.679 17.767 3C20.59 3.47 21.88 9.006 21.767 10C21.687 10.703 20.042 11.722 18.111 11C16.85 10.528 16.256 9.55 15.872 8.5"
       variants={rightEarVariants}
       style={{ transformBox: "view-box", originX: "14px", originY: "5.277px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

DogIcon.displayName = "DogIcon";
export { DogIcon };
