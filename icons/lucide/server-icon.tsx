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
export interface ServerIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ServerIconProps extends Omit<
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

const ServerIcon = forwardRef<ServerIconHandle, ServerIconProps>(
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

  const blinkVariants = (delay: number): Variants => ({
   normal: { opacity: 1, scale: 1 },
   animate: {
    opacity: [1, 0.15, 1],
    scale: [1, 0.6, 1.2, 1],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

  const unitVariants = (delay: number): Variants => ({
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.92, 1.02, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     delay: delay * duration,
     times: [0, 0.35, 0.7, 1],
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
      <m.rect
       width="20"
       height="8"
       x="2"
       y="2"
       rx="2"
       ry="2"
       variants={unitVariants(0)}
       style={{ transformBox: "view-box", originX: "12px", originY: "6px" }}
      />
      <m.rect
       width="20"
       height="8"
       x="2"
       y="14"
       rx="2"
       ry="2"
       variants={unitVariants(0.15)}
       style={{ transformBox: "view-box", originX: "12px", originY: "18px" }}
      />
      <m.line
       x1="6"
       x2="6.01"
       y1="6"
       y2="6"
       variants={blinkVariants(0.1)}
       style={{ transformBox: "view-box", originX: "6px", originY: "6px" }}
      />
      <m.line
       x1="6"
       x2="6.01"
       y1="18"
       y2="18"
       variants={blinkVariants(0.25)}
       style={{ transformBox: "view-box", originX: "6px", originY: "18px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ServerIcon.displayName = "ServerIcon";
export { ServerIcon };
