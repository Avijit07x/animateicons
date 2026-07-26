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
  const headControls = useAnimation();
  const eyeControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   headControls.start("pant");
   eyeControls.start("blink");
  }, [headControls, eyeControls, reduced]);

  const stop = useCallback(() => {
   headControls.start("rest");
   eyeControls.start("open");
  }, [headControls, eyeControls]);

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

  const headVariants: Variants = {
   rest: { rotate: 0, y: 0 },
   pant: {
    rotate: [0, -3, 0, 3, 0],
    y: [0, -0.5, 0, -0.5, 0],
    transition: {
     duration: 0.7 * duration,
     ease: "easeInOut",
     repeat: Infinity,
    },
   },
  };

  const eyeVariants: Variants = {
   open: { scaleY: 1 },
   blink: {
    scaleY: [1, 1, 0.15, 1, 1],
    transition: {
     duration: 2.8 * duration,
     ease: "easeInOut",
     times: [0, 0.42, 0.47, 0.52, 1],
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
     animate={headControls}
     initial="rest"
     variants={headVariants}
     {...props}
     style={{
      color,
      transformOrigin: "bottom center",
      ...props.style,
     }}
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
      <path d="M11.25 16.25h1.5L12 17z" />
      <m.path
       d="M16 14v.5"
       animate={eyeControls}
       initial="open"
       variants={eyeVariants}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309" />
      <m.path
       d="M8 14v.5"
       animate={eyeControls}
       initial="open"
       variants={eyeVariants}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5" />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

DogIcon.displayName = "DogIcon";
export { DogIcon };
