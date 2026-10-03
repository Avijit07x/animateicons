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
export interface WazeIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface WazeIconProps extends Omit<
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

const WazeIcon = forwardRef<WazeIconHandle, WazeIconProps>(
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

  const hopVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -2, 0.4, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const blinkVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.1, 1],
    transition: {
     duration: 0.3 * duration,
     ease: "easeInOut",
     delay: 0.3 * duration,
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
      <m.g variants={hopVariants}>
       <m.path
        d="M16.3741 9.00098H16.2491M9.87415 9.00098H9.74915M16.4991 9.00098C16.4991 9.13905 16.3872 9.25098 16.2491 9.25098C16.1111 9.25098 15.9991 9.13905 15.9991 9.00098C15.9991 8.86291 16.1111 8.75098 16.2491 8.75098C16.3872 8.75098 16.4991 8.86291 16.4991 9.00098ZM9.99915 9.00098C9.99915 9.13905 9.88722 9.25098 9.74915 9.25098C9.61107 9.25098 9.49915 9.13905 9.49915 9.00098C9.49915 8.86291 9.61107 8.75098 9.74915 8.75098C9.88722 8.75098 9.99915 8.86291 9.99915 9.00098Z"
        variants={blinkVariants}
        style={{ transformBox: "view-box", originX: "13px", originY: "9px" }}
       />
       <path d="M15.9991 13.001C15.4003 13.8977 14.2811 14.501 12.9991 14.501C11.7172 14.501 10.598 13.8977 9.99915 13.001" />
       <path d="M11.28 18.8155C11.8343 18.9369 12.4101 19.001 13.0008 19.001C17.4191 19.001 21.0008 15.4193 21.0008 11.001C21.0008 6.5827 17.4191 3.00098 13.0008 3.00098C8.58252 3.00098 5.00079 6.5827 5.00079 11.001C5.00079 11.9363 4.79948 13.802 2.99915 14.7022C3.84969 16.6159 5.31673 17.7259 7.0011 18.3646" />
      </m.g>
      <path d="M11.0011 18.999C11.0011 20.1036 10.1057 20.999 9.0011 20.999C7.89653 20.999 7.0011 20.1036 7.0011 18.999C7.0011 17.8945 7.89653 16.999 9.0011 16.999C10.1057 16.999 11.0011 17.8945 11.0011 18.999Z" />
      <path d="M15.0011 18.999C15.0011 20.1036 15.8965 20.999 17.0011 20.999C18.1057 20.999 19.0011 20.1036 19.0011 18.999C19.0011 18.4027 18.7402 17.8674 18.3262 17.501" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

WazeIcon.displayName = "WazeIcon";
export { WazeIcon };
