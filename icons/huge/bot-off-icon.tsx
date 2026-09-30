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
export interface BotOffIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface BotOffIconProps extends Omit<
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

const BotOffIcon = forwardRef<BotOffIconHandle, BotOffIconProps>(
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
       <path d="M18.5 18.7071C17.8984 18.9995 16.9958 18.9995 15.5 18.9995H12.6304C12.3177 18.9995 12.1613 18.9995 12.0146 19.0458C11.8678 19.0921 11.7397 19.1817 11.4835 19.3611L9.86731 20.4924C8.74196 21.2802 8.17928 21.674 7.71769 21.5382C7.59333 21.5016 7.47728 21.4412 7.37599 21.3603C7 21.06 7 20.3732 7 18.9995C6.53534 18.9995 6.30302 18.9995 6.10982 18.9611C5.31644 18.8033 4.69624 18.1831 4.53843 17.3897C4.5 17.1965 4.5 16.9642 4.5 16.4995V11.9995C4.5 10.1139 4.5 9.17111 5.08579 8.58532C5.61733 8.05377 6.44285 8.00456 8 8" />
       <path d="M19.4957 16C19.5 15.6996 19.5 15.3677 19.5 15V12C19.5 10.1144 19.5 9.17157 18.9142 8.58579C18.3284 8 17.3856 8 15.5 8H12" />
       <path d="M12 8V5" />
       <path d="M4.50098 16H4.00098C3.05817 16 2.58676 16 2.29387 15.7071C2.00098 15.4142 2.00098 14.9428 2.00098 14V12.5C2.00098 12.0341 2.00098 11.8011 2.0771 11.6173C2.17859 11.3723 2.37327 11.1776 2.61829 11.0761C2.80206 11 3.03504 11 3.50098 11H4.50098" />
       <path d="M19.4971 11H19.9971C20.9399 11 21.4113 11 21.7042 11.2929C21.9971 11.5858 21.9971 12.0572 21.9971 13V14C21.9971 14.9428 21.9971 15.4142 21.7042 15.7071C21.4113 16 20.9399 16 19.9971 16H19.4971" />
       <path d="M13.5 3.5C13.5 4.32843 12.8284 5 12 5C11.1716 5 10.5 4.32843 10.5 3.5C10.5 2.67157 11.1716 2 12 2C12.8284 2 13.5 2.67157 13.5 3.5Z" />
       <path d="M9 11.5V12.5" />
       <path d="M10 15.5C10 15.5 10.6667 16 12 16C13.3333 16 14 15.5 14 15.5" />
      </m.g>
      <m.path
       d="M2 2L22 22"
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

BotOffIcon.displayName = "BotOffIcon";
export { BotOffIcon };
