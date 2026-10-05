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
 useId,
 useRef,
 type HTMLAttributes,
} from "react";
export interface MailOpen01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MailOpen01IconProps extends Omit<
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

const MailOpen01Icon = forwardRef<MailOpen01IconHandle, MailOpen01IconProps>(
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
  const clipId = useId().replace(/:/g, "");
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

  const paperVariants: Variants = {
   normal: { y: 14, opacity: 0, transition: { duration: 0 } },
   animate: {
    y: [-9, 0, 14],
    opacity: [0, 1, 1],
    transition: {
     y: { duration: 0.8 * duration, ease: "easeInOut", times: [0, 0.4, 1] },
     opacity: {
      duration: 0.8 * duration,
      ease: "easeOut",
      times: [0, 0.25, 1],
     },
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
      <defs>
       <clipPath id={clipId}>
        <path d="M-2 -20H26V9.5H22L17.7346 12.6072C16.7004 13.3606 15.8504 14 14.5 14H9.5C8.1496 14 7.2996 13.3606 6.2654 12.6072L2 9.5H-2Z" />
       </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
       <m.g variants={paperVariants} strokeWidth="1.5">
        <rect x="7" y="4" width="10" height="9.5" rx="1" />
        <path d="M9.5 7.3h5" />
        <path d="M9.5 10.3h3" />
       </m.g>
      </g>
      <path d="M2.01592 14.551C2.08186 17.5843 2.11484 19.1009 3.24611 20.2241C4.37738 21.3473 5.95183 21.3862 9.10072 21.4641C11.0393 21.512 12.9607 21.512 14.8993 21.4641C18.0482 21.3862 19.6226 21.3473 20.7539 20.2241C21.8852 19.1009 21.9181 17.5843 21.9841 14.551C22.0164 13.0649 21.9995 11.5934 21.9334 10.0921C21.8924 9.15964 21.8719 8.69341 21.6354 8.27984C21.3989 7.86628 20.9913 7.59935 20.176 7.0655L16.4152 4.60286C14.2742 3.20096 13.2038 2.5 12 2.5C10.7962 2.5 9.72577 3.20095 7.58483 4.60286L3.82397 7.0655C3.00869 7.59935 2.60106 7.86628 2.36459 8.27984C2.12812 8.69341 2.1076 9.15965 2.06656 10.0921C2.00049 11.5934 1.98361 13.0649 2.01592 14.551Z" />
      <path d="M22 9.5L17.7346 12.6072C16.7004 13.3606 15.8504 14 14.5 14M2 9.5L6.26538 12.6072C7.29955 13.3606 8.14961 14 9.5 14" />
      <path d="M2 19L8.91302 14.2905C11.4387 12.5698 12.5613 12.5698 15.087 14.2905L22 19" />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MailOpen01Icon.displayName = "MailOpen01Icon";
export { MailOpen01Icon };
