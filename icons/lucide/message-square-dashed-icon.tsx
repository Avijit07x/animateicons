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
export interface MessageSquareDashedIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MessageSquareDashedIconProps extends Omit<
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

const MessageSquareDashedIcon = forwardRef<
 MessageSquareDashedIconHandle,
 MessageSquareDashedIconProps
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
       d="M4 3a2 2 0 0 0-2 2v1"
       variants={dashVariants}
       custom={[-1, -1, 0]}
      />
      <m.path d="M8 3h2" variants={dashVariants} custom={[0, 0, 1]} />
      <m.path d="M14 3h2" variants={dashVariants} custom={[0, 0, 2]} />
      <m.path
       d="M22 6V5a2 2 0 0 0-2-2"
       variants={dashVariants}
       custom={[1, -1, 3]}
      />
      <m.path d="M22 10v2" variants={dashVariants} custom={[0, 0, 4]} />
      <m.path
       d="M20 19a2 2 0 0 0 2-2v-1"
       variants={dashVariants}
       custom={[1, 1, 5]}
      />
      <m.path d="M16 19h-2" variants={dashVariants} custom={[0, 0, 6]} />
      <m.path d="M8 19h2" variants={dashVariants} custom={[0, 0, 7]} />
      <m.path
       d="M2 16v5.286a.71.71 0 0 0 1.212.502l1.149-1.149"
       variants={dashVariants}
       custom={[-1, 1, 8]}
      />
      <m.path d="M2 12v-2" variants={dashVariants} custom={[0, 0, 9]} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MessageSquareDashedIcon.displayName = "MessageSquareDashedIcon";
export { MessageSquareDashedIcon };
