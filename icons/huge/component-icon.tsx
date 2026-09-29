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
export interface ComponentIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ComponentIconProps extends Omit<
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

const ComponentIcon = forwardRef<ComponentIconHandle, ComponentIconProps>(
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

  const spinVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, 90],
    scale: [1, 0.85, 1],
    transition: { duration: 0.7 * duration, ease: "easeInOut" },
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
      <m.g
       variants={spinVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M9.19671 6.83999C9.33456 7.11818 9.59244 7.37605 10.1082 7.89181C10.6239 8.40756 10.8818 8.66544 11.16 8.80329C11.6893 9.06557 12.3107 9.06557 12.84 8.80329C13.1182 8.66544 13.3761 8.40756 13.8918 7.89181C14.4076 7.37605 14.6654 7.11818 14.8033 6.83999C15.0656 6.31071 15.0656 5.68929 14.8033 5.16001C14.6654 4.88182 14.4076 4.62395 13.8918 4.10819C13.3761 3.59244 13.1182 3.33456 12.84 3.19671C12.3107 2.93443 11.6893 2.93443 11.16 3.19671C10.8818 3.33456 10.6239 3.59244 10.1082 4.10819C9.59244 4.62395 9.33456 4.88182 9.19671 5.16001C8.93443 5.68929 8.93443 6.31071 9.19671 6.83999Z" />
       <path d="M3.19671 12.84C3.33456 13.1182 3.59244 13.3761 4.10819 13.8918C4.62395 14.4076 4.88182 14.6654 5.16001 14.8033C5.68929 15.0656 6.31071 15.0656 6.83999 14.8033C7.11818 14.6654 7.37605 14.4076 7.89181 13.8918C8.40756 13.3761 8.66544 13.1182 8.80329 12.84C9.06557 12.3107 9.06557 11.6893 8.80329 11.16C8.66544 10.8818 8.40756 10.6239 7.89181 10.1082C7.37605 9.59244 7.11818 9.33456 6.83999 9.19671C6.31071 8.93443 5.68929 8.93443 5.16001 9.19671C4.88182 9.33456 4.62395 9.59244 4.10819 10.1082C3.59244 10.6239 3.33456 10.8818 3.19671 11.16C2.93443 11.6893 2.93443 12.3107 3.19671 12.84Z" />
       <path d="M15.1967 12.84C15.3346 13.1182 15.5924 13.3761 16.1082 13.8918C16.6239 14.4076 16.8818 14.6654 17.16 14.8033C17.6893 15.0656 18.3107 15.0656 18.84 14.8033C19.1182 14.6654 19.3761 14.4076 19.8918 13.8918C20.4076 13.3761 20.6654 13.1182 20.8033 12.84C21.0656 12.3107 21.0656 11.6893 20.8033 11.16C20.6654 10.8818 20.4076 10.6239 19.8918 10.1082C19.3761 9.59244 19.1182 9.33456 18.84 9.19671C18.3107 8.93443 17.6893 8.93443 17.16 9.19671C16.8818 9.33456 16.6239 9.59244 16.1082 10.1082C15.5924 10.6239 15.3346 10.8818 15.1967 11.16C14.9344 11.6893 14.9344 12.3107 15.1967 12.84Z" />
       <path d="M9.19671 18.84C9.33456 19.1182 9.59244 19.3761 10.1082 19.8918C10.6239 20.4076 10.8818 20.6654 11.16 20.8033C11.6893 21.0656 12.3107 21.0656 12.84 20.8033C13.1182 20.6654 13.3761 20.4076 13.8918 19.8918C14.4076 19.3761 14.6654 19.1182 14.8033 18.84C15.0656 18.3107 15.0656 17.6893 14.8033 17.16C14.6654 16.8818 14.4076 16.6239 13.8918 16.1082C13.3761 15.5924 13.1182 15.3346 12.84 15.1967C12.3107 14.9344 11.6893 14.9344 11.16 15.1967C10.8818 15.3346 10.6239 15.5924 10.1082 16.1082C9.59244 16.6239 9.33456 16.8818 9.19671 17.16C8.93443 17.6893 8.93443 18.3107 9.19671 18.84Z" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ComponentIcon.displayName = "ComponentIcon";
export { ComponentIcon };
