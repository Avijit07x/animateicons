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

export interface ClockIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ClockIconProps extends Omit<
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

const ClockIcon = forwardRef<ClockIconHandle, ClockIconProps>(
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

  const start = useCallback(() => {
   if (reduced) return;
   controls.start("run");
  }, [controls, reduced]);

  const stop = useCallback(() => {
   controls.stop();
  }, [controls]);

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

  const minuteVariants: Variants = {
   rest: { rotate: 0 },
   run: {
    rotate: [0, 360],
    transition: {
     duration: 2 * duration,
     ease: "linear",
     repeat: Infinity,
     repeatType: "loop",
    },
   },
  };

  const hourVariants: Variants = {
   rest: { rotate: 0 },
   run: {
    rotate: [0, 360],
    transition: {
     duration: 24 * duration,
     ease: "linear",
     repeat: Infinity,
     repeatType: "loop",
    },
   },
  };

  const pivot = {
   transformBox: "view-box",
   originX: "12px",
   originY: "12px",
  } as const;

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
       d="M12 12V6"
       animate={controls}
       initial="rest"
       variants={minuteVariants}
       style={pivot}
      />
      <m.path
       d="M12 12l4 2"
       animate={controls}
       initial="rest"
       variants={hourVariants}
       style={pivot}
      />
      <circle cx="12" cy="12" r="10" />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ClockIcon.displayName = "ClockIcon";
export { ClockIcon };
