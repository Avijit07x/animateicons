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
export interface MessageCircleDashedIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MessageCircleDashedIconProps extends Omit<
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

const MessageCircleDashedIcon = forwardRef<
 MessageCircleDashedIconHandle,
 MessageCircleDashedIconProps
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

  const dashVariants: Variants = {
   normal: { x: 0, y: 0, opacity: 1 },
   animate: ([dx, dy, i]: number[]) => ({
    x: [0, dx, 0],
    y: [0, dy, 0],
    opacity: [1, 0.2, 1],
    transition: {
     x: { duration: 0.6 * duration, ease: "easeInOut" },
     y: { duration: 0.6 * duration, ease: "easeInOut" },
     opacity: {
      duration: 0.4 * duration,
      ease: "easeInOut",
      delay: i * 0.05 * duration,
     },
    },
   }),
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
       d="M10.1 2.182a10 10 0 0 1 3.8 0"
       variants={dashVariants}
       custom={[0, -1, 0]}
      />
      <m.path
       d="M17.609 3.72a10 10 0 0 1 2.69 2.7"
       variants={dashVariants}
       custom={[0.7, -0.7, 1]}
      />
      <m.path
       d="M21.818 10.1a10 10 0 0 1 0 3.8"
       variants={dashVariants}
       custom={[1, 0, 2]}
      />
      <m.path
       d="M20.28 17.61a10 10 0 0 1-2.7 2.69"
       variants={dashVariants}
       custom={[0.7, 0.7, 3]}
      />
      <m.path
       d="M13.9 21.818a10 10 0 0 1-3.8 0"
       variants={dashVariants}
       custom={[0, 1, 4]}
      />
      <m.path
       d="m6.163 21.117-2.906.85a1 1 0 0 1-1.236-1.169l.965-2.98"
       variants={dashVariants}
       custom={[-0.7, 0.7, 5]}
      />
      <m.path
       d="M2.182 13.9a10 10 0 0 1 0-3.8"
       variants={dashVariants}
       custom={[-1, 0, 6]}
      />
      <m.path
       d="M3.721 6.391a10 10 0 0 1 2.7-2.69"
       variants={dashVariants}
       custom={[-0.7, -0.7, 7]}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MessageCircleDashedIcon.displayName = "MessageCircleDashedIcon";
export { MessageCircleDashedIcon };
