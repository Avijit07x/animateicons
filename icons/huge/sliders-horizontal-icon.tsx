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
export interface SlidersHorizontalIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SlidersHorizontalIconProps extends Omit<
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

const SlidersHorizontalIcon = forwardRef<
 SlidersHorizontalIconHandle,
 SlidersHorizontalIconProps
>(
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

  const knob0Variants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, 4, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0 * duration,
    },
   },
  };

  const first0Variants: Variants = {
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, 1.667, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0 * duration,
    },
   },
  };

  const second0Variants: Variants = {
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, 0.429, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0 * duration,
    },
   },
  };
  const knob1Variants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, -2, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
    },
   },
  };

  const first1Variants: Variants = {
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, 0.778, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
    },
   },
  };

  const second1Variants: Variants = {
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, 1.5, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
    },
   },
  };
  const knob2Variants: Variants = {
   normal: { x: 0 },
   animate: {
    x: [0, 3, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.2 * duration,
    },
   },
  };

  const first2Variants: Variants = {
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, 1.6, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.2 * duration,
    },
   },
  };

  const second2Variants: Variants = {
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, 0.625, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.2 * duration,
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
      <m.path
       d="M3.99963 5.00055L9.99963 5.00031"
       variants={first0Variants}
       style={{ transformBox: "view-box", originX: "4px", originY: "5px" }}
      />
      <m.path
       d="M12.9996 5.00031L19.9996 5.00031"
       variants={second0Variants}
       style={{ transformBox: "view-box", originX: "20px", originY: "5px" }}
      />
      <m.path d="M15.9996 9.00031L15.9996 15.0003" variants={knob1Variants} />
      <m.path d="M9.99963 2.00031L9.99963 8.00031" variants={knob0Variants} />
      <m.path d="M11.9996 16.0003L11.9996 22.0003" variants={knob2Variants} />
      <m.path
       d="M15.9996 12.0001L19.9996 12.0003"
       variants={second1Variants}
       style={{ transformBox: "view-box", originX: "20px", originY: "12px" }}
      />
      <m.path
       d="M3.99963 12.0005L12.9996 12.0003"
       variants={first1Variants}
       style={{ transformBox: "view-box", originX: "4px", originY: "12px" }}
      />
      <m.path
       d="M11.9996 19.0003L19.9996 19.0003"
       variants={second2Variants}
       style={{ transformBox: "view-box", originX: "20px", originY: "19px" }}
      />
      <m.path
       d="M3.99963 19.0005L8.99963 19.0003"
       variants={first2Variants}
       style={{ transformBox: "view-box", originX: "4px", originY: "19px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SlidersHorizontalIcon.displayName = "SlidersHorizontalIcon";
export { SlidersHorizontalIcon };
