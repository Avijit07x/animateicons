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
export interface PanelBottomIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface PanelBottomIconProps extends Omit<
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

const PanelBottomIcon = forwardRef<PanelBottomIconHandle, PanelBottomIconProps>(
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

  const dividerVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -3, 0],
    transition: {
     duration: 0.6 * duration,
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
     >
      <m.path d="M2.99219 15.0001H20.9922" variants={dividerVariants} />
      <path d="M2.49219 12.0001C2.49219 7.52178 2.49219 5.28261 3.88343 3.89136C5.27467 2.50012 7.51384 2.50012 11.9922 2.50012C16.4705 2.50012 18.7097 2.50012 20.1009 3.89136C21.4922 5.28261 21.4922 7.52178 21.4922 12.0001C21.4922 16.4785 21.4922 18.7176 20.1009 20.1089C18.7097 21.5001 16.4705 21.5001 11.9922 21.5001C7.51384 21.5001 5.27467 21.5001 3.88343 20.1089C2.49219 18.7176 2.49219 16.4785 2.49219 12.0001Z" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

PanelBottomIcon.displayName = "PanelBottomIcon";
export { PanelBottomIcon };
