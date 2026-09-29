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
export interface SlidersVerticalIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface SlidersVerticalIconProps extends Omit<
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

const SlidersVerticalIcon = forwardRef<
 SlidersVerticalIconHandle,
 SlidersVerticalIconProps
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
   normal: { y: 0 },
   animate: {
    y: [0, -3, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0 * duration,
    },
   },
  };

  const first0Variants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.571, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0 * duration,
    },
   },
  };

  const second0Variants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 1.5, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0 * duration,
    },
   },
  };
  const knob1Variants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, 4, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
    },
   },
  };

  const first1Variants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 2, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
    },
   },
  };

  const second1Variants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.556, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
    },
   },
  };
  const knob2Variants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -3, 0],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.2 * duration,
    },
   },
  };

  const first2Variants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 0.625, 1],
    transition: {
     duration: 0.9 * duration,
     ease: "easeInOut",
     delay: 0.2 * duration,
    },
   },
  };

  const second2Variants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, 1.6, 1],
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
       d="M5.00018 20.0001L4.99994 14.0001"
       variants={second0Variants}
       style={{ transformBox: "view-box", originX: "5px", originY: "20px" }}
      />
      <m.path
       d="M4.99994 11.0001V4.00006"
       variants={first0Variants}
       style={{ transformBox: "view-box", originX: "5px", originY: "4px" }}
      />
      <m.path d="M8.99994 8.00006H14.9999" variants={knob1Variants} />
      <m.path d="M1.99994 14.0001H7.99994" variants={knob0Variants} />
      <m.path d="M15.9999 12.0001H21.9999" variants={knob2Variants} />
      <m.path
       d="M11.9997 8.00006L11.9999 4.00006"
       variants={first1Variants}
       style={{ transformBox: "view-box", originX: "12px", originY: "4px" }}
      />
      <m.path
       d="M12.0002 20.0001L11.9999 11.0001"
       variants={second1Variants}
       style={{ transformBox: "view-box", originX: "12px", originY: "20px" }}
      />
      <m.path
       d="M18.9999 12.0001L18.9999 4.00006"
       variants={first2Variants}
       style={{ transformBox: "view-box", originX: "19px", originY: "4px" }}
      />
      <m.path
       d="M19.0002 20.0001L18.9999 15.0001"
       variants={second2Variants}
       style={{ transformBox: "view-box", originX: "19px", originY: "20px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

SlidersVerticalIcon.displayName = "SlidersVerticalIcon";
export { SlidersVerticalIcon };
