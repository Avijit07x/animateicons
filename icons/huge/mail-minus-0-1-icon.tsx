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
export interface MailMinus01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MailMinus01IconProps extends Omit<
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

const MailMinus01Icon = forwardRef<MailMinus01IconHandle, MailMinus01IconProps>(
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

  const flapVariants: Variants = {
   normal: { scaleY: 1 },
   animate: {
    scaleY: [1, -0.9, -0.9, 1],
    transition: {
     duration: 0.8 * duration,
     ease: "easeInOut",
     times: [0, 0.4, 0.65, 1],
    },
   },
  };

  const minusVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, 180],
    scale: [1, 1.3, 1],
    transition: { duration: 0.5 * duration, ease: "easeInOut" },
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
      <path d="M11.5 20.4989C10.7011 20.4954 9.90159 20.4836 9.09883 20.4634C5.95033 20.3843 4.37608 20.3448 3.24496 19.2094C2.11383 18.0739 2.08114 16.5412 2.01577 13.4756C1.99475 12.4899 1.99474 11.5101 2.01576 10.5244C2.08114 7.45885 2.11382 5.92608 3.24495 4.79065C4.37608 3.65521 5.95033 3.61566 9.09882 3.53656C11.0393 3.48781 12.9607 3.48781 14.9012 3.53657C18.0497 3.61568 19.6239 3.65523 20.7551 4.79066C21.8862 5.92609 21.9189 7.45886 21.9842 10.5244C22.0019 11.3514 22.0047 12.1744 21.9928 13.0001" />
      <m.path
       d="M2 6L8.91302 9.92462C11.4387 11.3585 12.5613 11.3585 15.087 9.92462L22 6"
       variants={flapVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "6px" }}
      />
      <m.path
       d="M14 18.5H22"
       variants={minusVariants}
       style={{ transformBox: "view-box", originX: "18px", originY: "18.5px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MailMinus01Icon.displayName = "MailMinus01Icon";
export { MailMinus01Icon };
