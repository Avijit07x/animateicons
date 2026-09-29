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
export interface MinimizeScreenIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MinimizeScreenIconProps extends Omit<
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

const MinimizeScreenIcon = forwardRef<
 MinimizeScreenIconHandle,
 MinimizeScreenIconProps
>(
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

  const arrowVariants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, -1.5, 0],
    y: [0, 1.5, 0],
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
      <m.g variants={arrowVariants}>
       <path d="M11.4333 16.0659L8.6912 15.9658C8.28365 15.951 7.96094 15.6163 7.96094 15.2084L7.96094 12.5936" />
       <path d="M13.4609 10.5659L8.41716 15.5843" />
      </m.g>
      <path d="M22 7C22 8.8856 22 9.8284 21.4142 10.4142C20.8284 11 19.8856 11 18 11H17C15.1144 11 14.1716 11 13.5858 10.4142C13 9.8284 13 8.8856 13 7L13 6C13 4.1144 13 3.1716 13.5858 2.5858C14.1716 2 15.1144 2 17 2L18 2C19.8856 2 20.8284 2 21.4142 2.5858C22 3.1716 22 4.1144 22 6V7Z" />
      <path d="M22 15.5V13.5M10 22H14M2 10L2 14M10.5 2L8.5 2M21.9401 18.5C21.7861 19.5656 21.4865 20.321 20.9037 20.9038C20.321 21.4865 19.5656 21.7861 18.5 21.9401M5.5 21.9401C4.4344 21.7861 3.679 21.4865 3.0963 20.9037C2.5135 20.321 2.2139 19.5656 2.0599 18.5M2.0599 5.5C2.2139 4.4344 2.5135 3.679 3.0963 3.0963C3.679 2.5135 4.4344 2.2139 5.5 2.0599" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MinimizeScreenIcon.displayName = "MinimizeScreenIcon";
export { MinimizeScreenIcon };
