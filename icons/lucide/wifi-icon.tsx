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
export interface WifiIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface WifiIconProps extends Omit<
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

const WifiIcon = forwardRef<WifiIconHandle, WifiIconProps>(
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
  const groupControls = useAnimation();
  const arcLargeControls = useAnimation();
  const arcMidControls = useAnimation();
  const arcSmallControls = useAnimation();
  const dotControls = useAnimation();
  const reduced = useReducedMotion();
  const isControlled = useRef(false);

  useImperativeHandle(ref, () => {
   isControlled.current = true;
   return {
    startAnimation: () => {
     if (reduced) {
      groupControls.start("normal");
      arcLargeControls.start("normal");
      arcMidControls.start("normal");
      arcSmallControls.start("normal");
      dotControls.start("normal");
     } else {
      groupControls.start("animate");
      arcLargeControls.start("animate");
      arcMidControls.start("animate");
      arcSmallControls.start("animate");
      dotControls.start("animate");
     }
    },
    stopAnimation: () => {
     groupControls.start("normal");
     arcLargeControls.start("normal");
     arcMidControls.start("normal");
     arcSmallControls.start("normal");
     dotControls.start("normal");
    },
   };
  });

  const handleEnter = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnimated || reduced) return;
    if (!isControlled.current) {
     groupControls.start("animate");
     arcLargeControls.start("animate");
     arcMidControls.start("animate");
     arcSmallControls.start("animate");
     dotControls.start("animate");
    } else onMouseEnter?.(e as any);
   },
   [
    groupControls,
    arcLargeControls,
    arcMidControls,
    arcSmallControls,
    dotControls,
    reduced,
    onMouseEnter,
    isAnimated,
   ],
  );

  const handleLeave = useCallback(
   (e?: React.MouseEvent<HTMLDivElement>) => {
    if (!isControlled.current) {
     groupControls.start("normal");
     arcLargeControls.start("normal");
     arcMidControls.start("normal");
     arcSmallControls.start("normal");
     dotControls.start("normal");
    } else onMouseLeave?.(e as any);
   },
   [
    groupControls,
    arcLargeControls,
    arcMidControls,
    arcSmallControls,
    dotControls,
    onMouseLeave,
   ],
  );

  const groupVariants: Variants = {
   normal: { scale: 1 },
   animate: {
    scale: [1, 1.05, 0.99, 1],
    transition: {
     duration: 0.7 * duration,
     times: [0, 0.5, 0.8, 1],
     ease: "easeOut",
    },
   },
  };

  const dotVariants: Variants = {
   normal: { scale: 1, opacity: 1 },
   animate: {
    scale: [0.4, 1.25, 1],
    opacity: [0, 1, 1],
    transition: {
     duration: 0.35 * duration,
     times: [0, 0.6, 1],
     ease: "easeOut",
    },
   },
  };

  const arcSmallVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [9, 0],
    opacity: [0, 1],
    transition: { duration: 0.3 * duration, delay: 0.12 * duration, ease: "easeOut" },
   },
  };

  const arcMidVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [17, 0],
    opacity: [0, 1],
    transition: { duration: 0.35 * duration, delay: 0.24 * duration, ease: "easeOut" },
   },
  };

  const arcLargeVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [23, 0],
    opacity: [0, 1],
    transition: { duration: 0.4 * duration, delay: 0.36 * duration, ease: "easeOut" },
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
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="normal"
      animate={groupControls}
      variants={groupVariants}
     >
      <m.path
       d="M12 20h.01"
       initial="normal"
       animate={dotControls}
       variants={dotVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "20px" }}
      />
      <m.path
       d="M2 8.82a15 15 0 0 1 20 0"
       strokeDasharray="23"
       initial="normal"
       animate={arcLargeControls}
       variants={arcLargeVariants}
      />
      <m.path
       d="M5 12.859a10 10 0 0 1 14 0"
       strokeDasharray="17"
       initial="normal"
       animate={arcMidControls}
       variants={arcMidVariants}
      />
      <m.path
       d="M8.5 16.429a5 5 0 0 1 7 0"
       strokeDasharray="9"
       initial="normal"
       animate={arcSmallControls}
       variants={arcSmallVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

WifiIcon.displayName = "WifiIcon";
export { WifiIcon };
