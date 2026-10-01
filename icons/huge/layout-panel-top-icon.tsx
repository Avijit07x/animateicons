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
export interface LayoutPanelTopIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface LayoutPanelTopIconProps extends Omit<
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

const LayoutPanelTopIcon = forwardRef<
 LayoutPanelTopIconHandle,
 LayoutPanelTopIconProps
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

  const tileVariants = (delay: number): Variants => ({
   normal: { scale: 1 },
   animate: {
    scale: [1, 0.85, 1.05, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.35, 0.7, 1],
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
      <m.path
       d="M17.7463 2.49976C19.39 2.49976 20.2119 2.49976 20.7651 2.95374C20.8663 3.03684 20.9592 3.1297 21.0423 3.23097C21.4963 3.78414 21.4963 4.60602 21.4963 6.24976C21.4963 7.8935 21.4963 8.71537 21.0423 9.26854C20.9592 9.36981 20.8663 9.46267 20.7651 9.54578C20.2119 9.99976 19.39 9.99976 17.7463 9.99976L6.74628 9.99976C5.10254 9.99976 4.28067 9.99976 3.72749 9.54578C3.62622 9.46267 3.53336 9.36981 3.45026 9.26854C2.99628 8.71537 2.99628 7.8935 2.99628 6.24976C2.99628 4.60601 2.99628 3.78414 3.45026 3.23097C3.53336 3.1297 3.62622 3.03684 3.72749 2.95373C4.28067 2.49976 5.10254 2.49976 6.74628 2.49976L17.7463 2.49976Z"
       variants={tileVariants(0)}
       style={{
        transformBox: "view-box",
        originX: "12.25px",
        originY: "6.25px",
       }}
      />
      <m.path
       d="M17.7462 13.9999C19.39 13.9998 20.2118 13.9998 20.765 14.4538C20.8663 14.5369 20.9592 14.6298 21.0423 14.731C21.4963 15.2842 21.4963 16.1061 21.4963 17.75C21.4963 19.3937 21.4963 20.2156 21.0423 20.7688C20.9592 20.8701 20.8664 20.9629 20.7651 21.046C20.2119 21.5 19.3901 21.5 17.7464 21.5001C16.1026 21.5001 15.2807 21.5001 14.7275 21.0462C14.6262 20.963 14.5334 20.8702 14.4503 20.7689C13.9963 20.2157 13.9963 19.3938 13.9963 17.75C13.9963 16.1062 13.9963 15.2843 14.4502 14.7312C14.5333 14.6299 14.6262 14.537 14.7275 14.4539C15.2806 13.9999 16.1025 13.9999 17.7462 13.9999Z"
       variants={tileVariants(0.1)}
       style={{
        transformBox: "view-box",
        originX: "17.75px",
        originY: "17.75px",
       }}
      />
      <m.path
       d="M6.24628 13.9998C7.89002 13.9998 8.71189 13.9998 9.26506 14.4537C9.36633 14.5368 9.45919 14.6297 9.5423 14.731C9.99628 15.2841 9.99628 16.1061 9.99628 17.7499C9.99628 19.3938 9.99628 20.2158 9.5423 20.7689C9.45919 20.8702 9.36633 20.9631 9.26506 21.0462C8.71189 21.5001 7.89002 21.5001 6.24628 21.5001C4.60254 21.5001 3.78067 21.5001 3.22749 21.0462C3.12622 20.9631 3.03336 20.8702 2.95026 20.7689C2.49628 20.2158 2.49628 19.3938 2.49628 17.7499C2.49628 16.1061 2.49628 15.2841 2.95026 14.731C3.03336 14.6297 3.12622 14.5368 3.22749 14.4537C3.78067 13.9998 4.60254 13.9998 6.24628 13.9998Z"
       variants={tileVariants(0.2)}
       style={{
        transformBox: "view-box",
        originX: "6.25px",
        originY: "17.75px",
       }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

LayoutPanelTopIcon.displayName = "LayoutPanelTopIcon";
export { LayoutPanelTopIcon };
