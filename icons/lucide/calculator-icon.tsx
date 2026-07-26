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

export interface CalculatorIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CalculatorIconProps extends Omit<
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

const CalculatorIcon = forwardRef<CalculatorIconHandle, CalculatorIconProps>(
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
  const keyControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  const start = useCallback(() => {
   if (reduced) return;
   keyControls.start("press");
  }, [keyControls, reduced]);

  const stop = useCallback(() => {
   keyControls.start("rest");
  }, [keyControls]);

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

  const keyVariants = (i: number): Variants => ({
   rest: { scale: 1, opacity: 1 },
   press: {
    scale: [1, 1.8, 1],
    opacity: [1, 1, 1],
    transition: {
     duration: 0.8 * duration,
     ease: [0.34, 1.4, 0.64, 1],
     delay: i * 0.06 * duration,
    },
   },
  });

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
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <m.path
       d="M16 10h.01"
       animate={keyControls}
       initial="rest"
       variants={keyVariants(0)}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <m.path
       d="M12 10h.01"
       animate={keyControls}
       initial="rest"
       variants={keyVariants(1)}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <m.path
       d="M8 10h.01"
       animate={keyControls}
       initial="rest"
       variants={keyVariants(2)}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <m.path
       d="M12 14h.01"
       animate={keyControls}
       initial="rest"
       variants={keyVariants(3)}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <m.path
       d="M8 14h.01"
       animate={keyControls}
       initial="rest"
       variants={keyVariants(4)}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <m.path
       d="M12 18h.01"
       animate={keyControls}
       initial="rest"
       variants={keyVariants(5)}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
      <m.path
       d="M8 18h.01"
       animate={keyControls}
       initial="rest"
       variants={keyVariants(6)}
       style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
     </svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CalculatorIcon.displayName = "CalculatorIcon";
export { CalculatorIcon };
