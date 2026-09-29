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
export interface FullScreenIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FullScreenIconProps extends Omit<
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

const FullScreenIcon = forwardRef<FullScreenIconHandle, FullScreenIconProps>(
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

  const corner0Variants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, 1.3, 0],
    y: [0, 1.3, 0],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  const corner1Variants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, 1.3, 0],
    y: [0, -1.3, 0],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  const corner2Variants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, -1.3, 0],
    y: [0, 1.3, 0],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
   },
  };

  const corner3Variants: Variants = {
   normal: { x: 0, y: 0 },
   animate: {
    x: [0, -1.3, 0],
    y: [0, -1.3, 0],
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
      <m.path
       d="M15.5 21C16.8956 21 17.5933 21 18.1611 20.8278C19.4395 20.44 20.44 19.4395 20.8278 18.1611C21 17.5933 21 16.8956 21 15.5"
       variants={corner0Variants}
      />
      <m.path
       d="M21 8.5C21 7.10444 21 6.40666 20.8278 5.83886C20.44 4.56046 19.4395 3.56004 18.1611 3.17224C17.5933 3 16.8956 3 15.5 3"
       variants={corner1Variants}
      />
      <m.path
       d="M8.5 21C7.10444 21 6.40666 21 5.83886 20.8278C4.56046 20.44 3.56004 19.4395 3.17224 18.1611C3 17.5933 3 16.8956 3 15.5"
       variants={corner2Variants}
      />
      <m.path
       d="M3 8.5C3 7.10444 3 6.40666 3.17224 5.83886C3.56004 4.56046 4.56046 3.56004 5.83886 3.17224C6.40666 3 7.10444 3 8.5 3"
       variants={corner3Variants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FullScreenIcon.displayName = "FullScreenIcon";
export { FullScreenIcon };
