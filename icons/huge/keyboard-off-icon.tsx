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
export interface KeyboardOffIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface KeyboardOffIconProps extends Omit<
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

const KeyboardOffIcon = forwardRef<KeyboardOffIconHandle, KeyboardOffIconProps>(
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

  const bodyVariants: Variants = {
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.4, 1],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
   },
  };

  const slashVariants: Variants = {
   normal: { strokeDashoffset: 0 },
   animate: {
    strokeDashoffset: [30, 0],
    transition: {
     duration: 0.45 * duration,
     ease: "easeInOut",
     delay: 0.1 * duration,
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
      <m.g variants={bodyVariants}>
       <path d="M6.9986 12L7.9986 12M11.4986 12L11.9986 12M15.9986 12L16.9986 12" />
       <path d="M6.9986 17L16.9986 17" />
       <path d="M20.5362 21.092C19.4298 21.9999 17.7861 21.9999 14.4986 21.9999H9.4986C6.21111 21.9999 4.56737 21.9999 3.46102 21.092C3.25849 20.9257 3.07277 20.74 2.90655 20.5375C1.9986 19.4311 1.9986 17.7874 1.9986 14.4999C1.9986 11.2124 1.9986 9.5687 2.90655 8.46235C3.07277 8.25981 3.25849 8.0741 3.46102 7.90788C4.24233 7.26668 5.29163 7.0783 6.9986 7.02295" />
       <path d="M21.9756 17C21.9986 16.2898 21.9986 15.4659 21.9986 14.5C21.9986 11.2125 21.9986 9.56878 21.0906 8.46243C20.9244 8.25989 20.7387 8.07418 20.5362 7.90796C19.4298 7 17.7861 7 14.4986 7H11.9986" />
       <path d="M11.9986 7V5C11.9986 4.44772 12.4463 4 12.9986 4C13.5509 4 13.9986 3.55228 13.9986 3V2" />
      </m.g>
      <m.path
       d="M1.9986 2L21.9986 22"
       strokeDasharray="30"
       strokeDashoffset="0"
       variants={slashVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

KeyboardOffIcon.displayName = "KeyboardOffIcon";
export { KeyboardOffIcon };
