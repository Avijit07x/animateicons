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

export interface GiftIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface GiftIconProps extends Omit<
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

const GiftIcon = forwardRef<GiftIconHandle, GiftIconProps>(
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
  const shakeControls = useAnimation();
  const bowControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   shakeControls.start("shake");
   bowControls.start("shake");
  }, [shakeControls, bowControls, reduced]);

  const stop = useCallback(() => {
   shakeControls.start("rest");
   bowControls.start("rest");
  }, [shakeControls, bowControls]);

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

  const shakeVariants: Variants = {
   rest: { rotate: 0 },
   shake: {
    rotate: [0, -7, 6, -4, 3, 0],
    transition: {
     duration: 1 * duration,
     ease: "easeInOut",
     times: [0, 0.18, 0.38, 0.58, 0.78, 1],
    },
   },
  };

  const bowVariants: Variants = {
   rest: { scale: 1 },
   shake: {
    scale: [1, 1.18, 0.96, 1.06, 1],
    transition: {
     duration: 0.8 * duration,
     ease: [0.34, 1.4, 0.64, 1],
     delay: 0.16 * duration,
    },
   },
  };

  return (
   <LazyMotion features={domMin} strict>
    <m.div
     className={cn("inline-flex items-center justify-center", className)}
     onMouseEnter={handleEnter}
     onMouseLeave={handleLeave}
     animate={shakeControls}
     initial="rest"
     variants={shakeVariants}
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
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <m.path
       d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"
       animate={bowControls}
       initial="rest"
       variants={bowVariants}
       style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

GiftIcon.displayName = "GiftIcon";
export { GiftIcon };
