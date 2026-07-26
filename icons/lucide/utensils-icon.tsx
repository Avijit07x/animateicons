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

export interface UtensilsIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface UtensilsIconProps extends Omit<
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

const UtensilsIcon = forwardRef<UtensilsIconHandle, UtensilsIconProps>(
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
  const forkControls = useAnimation();
  const knifeControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   forkControls.start("set");
   knifeControls.start("set");
  }, [forkControls, knifeControls, reduced]);

  const stop = useCallback(() => {
   forkControls.start("rest");
   knifeControls.start("rest");
  }, [forkControls, knifeControls]);

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

  const forkVariants: Variants = {
   rest: { rotate: 0 },
   set: {
    rotate: [0, -9, 2, 0],
    transition: {
     duration: 0.8 * duration,
     ease: [0.34, 1.4, 0.64, 1],
     times: [0, 0.4, 0.75, 1],
    },
   },
  };

  const knifeVariants: Variants = {
   rest: { rotate: 0 },
   set: {
    rotate: [0, 9, -2, 0],
    transition: {
     duration: 0.8 * duration,
     ease: [0.34, 1.4, 0.64, 1],
     times: [0, 0.4, 0.75, 1],
     delay: 0.08 * duration,
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
      <m.path
       d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"
       animate={forkControls}
       initial="rest"
       variants={forkVariants}
       style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
      />
      <m.path
       d="M7 2v20"
       animate={forkControls}
       initial="rest"
       variants={forkVariants}
       style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
      />
      <m.path
       d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"
       animate={knifeControls}
       initial="rest"
       variants={knifeVariants}
       style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

UtensilsIcon.displayName = "UtensilsIcon";
export { UtensilsIcon };
