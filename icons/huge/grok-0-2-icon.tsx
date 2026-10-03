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
export interface Grok02IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Grok02IconProps extends Omit<
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

const Grok02Icon = forwardRef<Grok02IconHandle, Grok02IconProps>(
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

  const flipVariants: Variants = {
   normal: { scaleX: 1 },
   animate: {
    scaleX: [1, -1, 1],
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
       variants={flipVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      >
       <path d="M7 9H3L12 22H16L7 9Z" />
       <path d="M6.14913 17.5016L3.00024 22H7.00024L8.13808 20.3745L6.14913 17.5016Z" />
       <path d="M12.9008 13.5706L21.0002 2H17.0002L10.9119 10.6976L12.9008 13.5706Z" />
       <path d="M18 10.2095V22H21V5.92383L18 10.2095Z" />
      </m.g>
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Grok02Icon.displayName = "Grok02Icon";
export { Grok02Icon };
