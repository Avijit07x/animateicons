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
export interface NewspaperIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface NewspaperIconProps extends Omit<
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

const NewspaperIcon = forwardRef<NewspaperIconHandle, NewspaperIconProps>(
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

  const drawVariants = (delay: number): Variants => ({
   normal: { scaleX: 1 },
   animate: {
    scaleX: [0, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeOut",
     delay: delay * duration,
    },
   },
  });

  const columnVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [0, 1],
    transition: {
     duration: 0.35 * duration,
     ease: "easeOut",
     delay: 0.36 * duration,
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
      <path d="M19.4922 21H7.49219C5.13516 21 3.95665 21 3.22442 20.2678C2.49219 19.5355 2.49219 18.357 2.49219 16V8C2.49219 5.64298 2.49219 4.46447 3.22442 3.73223C3.95665 3 5.13516 3 7.49219 3H12.4922C14.8492 3 16.0277 3 16.76 3.73223C17.4922 4.46447 17.4922 5.64298 17.4922 8" />
      <m.path
       d="M11.9922 6H7.99219C7.04938 6 6.57797 6 6.28508 6.29289C5.99219 6.58579 5.99219 7.05719 5.99219 8C5.99219 8.94281 5.99219 9.41421 6.28508 9.70711C6.57797 10 7.04938 10 7.99219 10H11.9922C12.935 10 13.4064 10 13.6993 9.70711C13.9922 9.41421 13.9922 8.94281 13.9922 8C13.9922 7.05719 13.9922 6.58579 13.6993 6.29289C13.4064 6 12.935 6 11.9922 6Z"
       variants={drawVariants(0)}
       style={{ transformBox: "view-box", originX: "6px", originY: "8px" }}
      />
      <m.path
       d="M5.99219 14L13.9922 14"
       variants={drawVariants(0.12)}
       style={{ transformBox: "view-box", originX: "6px", originY: "14px" }}
      />
      <m.path
       d="M5.99219 18H10.9922"
       variants={drawVariants(0.24)}
       style={{ transformBox: "view-box", originX: "6px", originY: "18px" }}
      />
      <m.path
       d="M17.4922 8H18.4922C19.9064 8 20.6135 8 21.0528 8.43934C21.4922 8.87868 21.4922 9.58579 21.4922 11V19C21.4922 20.1046 20.5968 21 19.4922 21C18.3876 21 17.4922 20.1046 17.4922 19V8Z"
       variants={columnVariants}
       style={{ transformBox: "view-box", originX: "19.5px", originY: "8px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

NewspaperIcon.displayName = "NewspaperIcon";
export { NewspaperIcon };
