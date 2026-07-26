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

export interface FishIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface FishIconProps extends Omit<
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

const FishIcon = forwardRef<FishIconHandle, FishIconProps>(
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
  const bodyControls = useAnimation();
  const tailControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   bodyControls.start("swim");
   tailControls.start("swim");
  }, [bodyControls, tailControls, reduced]);

  const stop = useCallback(() => {
   bodyControls.start("rest");
   tailControls.start("rest");
  }, [bodyControls, tailControls]);

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

  const bodyVariants: Variants = {
   rest: { rotate: 0 },
   swim: {
    rotate: [0, 3, 0, -3, 0],
    transition: {
     duration: 1 * duration,
     ease: "easeInOut",
     repeat: Infinity,
    },
   },
  };

  const tailVariants: Variants = {
   rest: { rotate: 0 },
   swim: {
    rotate: [0, -16, 0, 16, 0],
    transition: {
     duration: 1 * duration,
     ease: "easeInOut",
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
     animate={bodyControls}
     initial="rest"
     variants={bodyVariants}
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
      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
      <path d="M18 12v.5" />
      <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
      <m.path
       d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"
       animate={tailControls}
       initial="rest"
       variants={tailVariants}
       style={{ transformBox: "fill-box", transformOrigin: "right center" }}
      />
      <path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4" />
      <path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98" />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

FishIcon.displayName = "FishIcon";
export { FishIcon };
