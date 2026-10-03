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
export interface MistralIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MistralIconProps extends Omit<
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

const MistralIcon = forwardRef<MistralIconHandle, MistralIconProps>(
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

  const squashVariants: Variants = {
   normal: { scaleY: 1, scaleX: 1 },
   animate: {
    scaleY: [1, 0.88, 1.05, 1],
    scaleX: [1, 1.02, 0.98, 1],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.75, 1],
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
      <m.path
       d="M10.5 16.5V18.5C10.5 19.0523 10.0523 19.5 9.5 19.5H2.5C1.94772 19.5 1.5 19.0523 1.5 18.5V17.5C1.5 16.9477 1.94772 16.5 2.5 16.5H3.5C4.05228 16.5 4.5 16.0523 4.5 15.5V5.5C4.5 4.94772 4.94772 4.5 5.5 4.5H6.5C7.05228 4.5 7.5 4.94772 7.5 5.5V6.5C7.5 7.05228 7.94772 7.5 8.5 7.5H9.5C10.0523 7.5 10.5 7.94772 10.5 8.5V9.5C10.5 10.0523 10.9477 10.5 11.5 10.5H12.5C13.0523 10.5 13.5 10.0523 13.5 9.5V8.5C13.5 7.94772 13.9477 7.5 14.5 7.5H15.5C16.0523 7.5 16.5 7.05228 16.5 6.5V5.5C16.5 4.94772 16.9477 4.5 17.5 4.5H18.5C19.0523 4.5 19.5 4.94772 19.5 5.5V15.5C19.5 16.0523 19.9477 16.5 20.5 16.5H21.5C22.0523 16.5 22.5 16.9477 22.5 17.5V18.5C22.5 19.0523 22.0523 19.5 21.5 19.5H14.5C13.9477 19.5 13.5 19.0523 13.5 18.5V16.5M10.5 16.5H13.5M10.5 16.5H8.5C7.94772 16.5 7.5 16.0523 7.5 15.5V14.5C7.5 13.9477 7.94772 13.5 8.5 13.5H9.5C10.0523 13.5 10.5 13.9477 10.5 14.5V16.5ZM13.5 16.5H15.5C16.0523 16.5 16.5 16.0523 16.5 15.5V14.5C16.5 13.9477 16.0523 13.5 15.5 13.5H14.5C13.9477 13.5 13.5 13.9477 13.5 14.5V16.5Z"
       variants={squashVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "19.5px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MistralIcon.displayName = "MistralIcon";
export { MistralIcon };
