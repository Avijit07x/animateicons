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
export interface CpuIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface CpuIconProps extends Omit<
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

const CpuIcon = forwardRef<CpuIconHandle, CpuIconProps>(
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

  const pinVariants = (delay: number): Variants => ({
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.2, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

  const coreVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.75, 1.15, 1],
    transition: {
     duration: 0.6 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
     delay: 0.1 * duration,
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
      <m.path d="M7 2v2" variants={pinVariants(0)} />
      <m.path d="M12 2v2" variants={pinVariants(0.025)} />
      <m.path d="M17 2v2" variants={pinVariants(0.05)} />
      <m.path d="M20 7h2" variants={pinVariants(0.075)} />
      <m.path d="M20 12h2" variants={pinVariants(0.1)} />
      <m.path d="M20 17h2" variants={pinVariants(0.125)} />
      <m.path d="M17 20v2" variants={pinVariants(0.15)} />
      <m.path d="M12 20v2" variants={pinVariants(0.175)} />
      <m.path d="M7 20v2" variants={pinVariants(0.2)} />
      <m.path d="M2 17h2" variants={pinVariants(0.225)} />
      <m.path d="M2 12h2" variants={pinVariants(0.25)} />
      <m.path d="M2 7h2" variants={pinVariants(0.275)} />
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <m.rect
       x="8"
       y="8"
       width="8"
       height="8"
       rx="1"
       variants={coreVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

CpuIcon.displayName = "CpuIcon";
export { CpuIcon };
