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
export interface InstagramIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface InstagramIconProps extends Omit<
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

const InstagramIcon = forwardRef<InstagramIconHandle, InstagramIconProps>(
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

  const iconVariants: Variants = {
   normal: {
    scale: 1,
    rotate: 0,
   },
   animate: {
    scale: [1, 1.06, 1],
    rotate: 0,
    transition: {
     duration: 0.4 * duration,
     ease: "easeOut",
    },
   },
  };

  const frameVariants: Variants = {
   normal: {
    pathLength: 1,
    opacity: 1,
   },
   animate: {
    pathLength: [0.2, 1],
    opacity: [0.6, 1],
    transition: {
     duration: 0.55 * duration,
     ease: "easeInOut",
    },
   },
  };

  const lensVariants: Variants = {
   normal: {
    scale: 1,
    pathLength: 1,
   },
   animate: {
    scale: [0.85, 1.05, 1],
    pathLength: [0, 1],
    transition: {
     duration: 0.5 * duration,
     delay: 0.1 * duration,
     ease: "easeOut",
    },
   },
  };

  const dotVariants: Variants = {
   normal: {
    scale: 1,
    opacity: 1,
   },
   animate: {
    scale: [1, 1.5, 1],
    opacity: [1, 0.4, 1],
    transition: {
     duration: 0.35 * duration,
     delay: 0.2 * duration,
     ease: "easeInOut",
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
      variants={iconVariants}
     >
      <m.rect
       width="20"
       height="20"
       x="2"
       y="2"
       rx="5"
       ry="5"
       variants={frameVariants}
      />
      <m.path
       d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
       variants={lensVariants}
      />
      <m.line x1="17.5" x2="17.51" y1="6.5" y2="6.5" variants={dotVariants} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

InstagramIcon.displayName = "InstagramIcon";
export { InstagramIcon };
