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

export interface RabbitIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface RabbitIconProps extends Omit<
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

const RabbitIcon = forwardRef<RabbitIconHandle, RabbitIconProps>(
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
  const hopControls = useAnimation();
  const earControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   hopControls.start("hop");
   earControls.start("hop");
  }, [hopControls, earControls, reduced]);

  const stop = useCallback(() => {
   hopControls.start("rest");
   earControls.start("rest");
  }, [hopControls, earControls]);

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

  const hopVariants: Variants = {
   rest: { y: 0, scaleX: 1, scaleY: 1 },
   hop: {
    y: [0, 1.2, -3, 0.6, 0],
    scaleX: [1, 1.12, 0.94, 1.06, 1],
    scaleY: [1, 0.86, 1.1, 0.94, 1],
    transition: {
     duration: 0.85 * duration,
     ease: "easeInOut",
     times: [0, 0.22, 0.55, 0.8, 1],
     repeat: Infinity,
     repeatDelay: 0.15 * duration,
    },
   },
  };

  const earVariants: Variants = {
   rest: { rotate: 0 },
   hop: {
    rotate: [0, 14, -8, 3, 0],
    transition: {
     duration: 0.85 * duration,
     ease: "easeOut",
     times: [0, 0.28, 0.58, 0.82, 1],
     repeat: Infinity,
     repeatDelay: 0.15 * duration,
     delay: 0.06 * duration,
    },
   },
  };

  return (
   <LazyMotion features={domMin} strict>
    <m.div
     className={cn("inline-flex items-center justify-center", className)}
     onMouseEnter={handleEnter}
     onMouseLeave={handleLeave}
     animate={hopControls}
     initial="rest"
     variants={hopVariants}
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
      <path d="M13 16a3 3 0 0 1 2.24 5" />
      <path d="M18 12h.01" />
      <path d="M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3" />
      <m.path
       d="M20 8.54V4a2 2 0 1 0-4 0v3"
       animate={earControls}
       initial="rest"
       variants={earVariants}
       style={{ transformBox: "fill-box", transformOrigin: "bottom center" }}
      />
      <path d="M7.612 12.524a3 3 0 1 0-1.6 4.3" />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

RabbitIcon.displayName = "RabbitIcon";
export { RabbitIcon };
