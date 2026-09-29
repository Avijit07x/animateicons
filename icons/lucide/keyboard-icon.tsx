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
export interface KeyboardIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface KeyboardIconProps extends Omit<
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

const KeyboardIcon = forwardRef<KeyboardIconHandle, KeyboardIconProps>(
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

  const keyVariants = (dy: number, delay: number): Variants => ({
   normal: { y: 0 },
   animate: {
    y: [0, dy, 0],
    transition: {
     duration: 0.3 * duration,
     ease: "easeInOut",
     delay: delay * duration,
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
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <m.path d="M6 8h.01" variants={keyVariants(1.6, 0)} />
      <m.path d="M8 12h.01" variants={keyVariants(1.6, 0.05)} />
      <m.path d="M10 8h.01" variants={keyVariants(1.6, 0.1)} />
      <m.path d="M12 12h.01" variants={keyVariants(1.6, 0.15)} />
      <m.path d="M14 8h.01" variants={keyVariants(1.6, 0.2)} />
      <m.path d="M16 12h.01" variants={keyVariants(1.6, 0.25)} />
      <m.path d="M18 8h.01" variants={keyVariants(1.6, 0.3)} />
      <m.path d="M7 16h10" variants={keyVariants(1.2, 0.35)} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

KeyboardIcon.displayName = "KeyboardIcon";
export { KeyboardIcon };
