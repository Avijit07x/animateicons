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
export interface Notebook01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Notebook01IconProps extends Omit<
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

const Notebook01Icon = forwardRef<Notebook01IconHandle, Notebook01IconProps>(
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

  const tabVariants = (delay: number): Variants => ({
   normal: { x: 0 },
   animate: {
    x: [0, -1.6, 0],
    transition: {
     duration: 0.35 * duration,
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
      <path d="M22 14V10C22 6.22876 22 4.34315 20.8284 3.17157C19.6569 2 17.7712 2 14 2H12C8.22876 2 6.34315 2 5.17157 3.17157C4 4.34315 4 6.22876 4 10V14C4 17.7712 4 19.6569 5.17157 20.8284C6.34315 22 8.22876 22 12 22H14C17.7712 22 19.6569 22 20.8284 20.8284C22 19.6569 22 17.7712 22 14Z" />
      <path d="M11.7857 10H15.2143C16.2918 10 16.8305 10 17.1653 9.70711C17.5 9.41421 17.5 8.94281 17.5 8C17.5 7.05719 17.5 6.58579 17.1653 6.29289C16.8305 6 16.2918 6 15.2143 6H11.7857C10.7082 6 10.1695 6 9.83474 6.29289C9.5 6.58579 9.5 7.05719 9.5 8C9.5 8.94281 9.5 9.41421 9.83474 9.70711C10.1695 10 10.7082 10 11.7857 10Z" />
      <m.path d="M5 6L2 6" variants={tabVariants(0)} />
      <m.path d="M5 12H2" variants={tabVariants(0.1)} />
      <m.path d="M5 18H2" variants={tabVariants(0.2)} />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Notebook01Icon.displayName = "Notebook01Icon";
export { Notebook01Icon };
