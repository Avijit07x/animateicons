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

export interface Disc3IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Disc3IconProps extends Omit<
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

const Disc3Icon = forwardRef<Disc3IconHandle, Disc3IconProps>(
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
  const grooveControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   grooveControls.start("spin");
  }, [grooveControls, reduced]);

  const stop = useCallback(() => {
   grooveControls.stop();
  }, [grooveControls]);

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

  const grooveVariants: Variants = {
   rest: { rotate: 0 },
   spin: {
    rotate: [0, 360],
    transition: {
     duration: 1.8 * duration,
     ease: "linear",
     repeat: Infinity,
     repeatType: "loop",
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
      <circle cx="12" cy="12" r="10" />
      <m.path
       d="M6 12c0-1.7.7-3.2 1.8-4.2"
       animate={grooveControls}
       initial="rest"
       variants={grooveVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
      <circle cx="12" cy="12" r="2" />
      <m.path
       d="M18 12c0 1.7-.7 3.2-1.8 4.2"
       animate={grooveControls}
       initial="rest"
       variants={grooveVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Disc3Icon.displayName = "Disc3Icon";
export { Disc3Icon };
