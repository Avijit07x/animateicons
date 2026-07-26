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

export interface CatIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CatIconProps extends Omit<
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

const CatIcon = forwardRef<CatIconHandle, CatIconProps>(
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
   headControls.start("idle");
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
   idle: {
    rotate: [0, -10, -10, 0, 0],
    y: [0, 0, -0.6, 0, 0],
    transition: {
     duration: 2.6 * duration,
     ease: "easeInOut",
     times: [0, 0.18, 0.5, 0.68, 1],
     repeat: Infinity,
    },
   },
  };

  const eyeVariants: Variants = {
   open: { scaleY: 1 },
   blink: {
    scaleY: [1, 1, 0.1, 1, 1],
    transition: {
     duration: 2.6 * duration,
     ease: "easeInOut",
     times: [0, 0.34, 0.4, 0.46, 1],
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
      <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z" />
      <m.path
       d="M8 14v.5"
       animate={eyeControls}
       initial="open"
       variants={eyeVariants}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <m.path
       d="M16 14v.5"
       animate={eyeControls}
       initial="open"
       variants={eyeVariants}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <path d="M11.25 16.25h1.5L12 17l-.75-.75Z" />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CatIcon.displayName = "CatIcon";
export { CatIcon };
