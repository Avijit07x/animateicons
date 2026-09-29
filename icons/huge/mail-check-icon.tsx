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
export interface MailCheckIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MailCheckIconProps extends Omit<
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

const MailCheckIcon = forwardRef<MailCheckIconHandle, MailCheckIconProps>(
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

  const tickVariants: Variants = {
   normal: { strokeDashoffset: 0, opacity: 1 },
   animate: {
    strokeDashoffset: [12, 0],
    opacity: [0, 1],
    transition: {
     strokeDashoffset: {
      duration: 0.45 * duration,
      ease: "easeOut",
      delay: 0.15 * duration,
     },
     opacity: { duration: 0.1 * duration, delay: 0.15 * duration },
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
       d="M1.99609 6L8.90912 9.91697C11.4577 11.361 12.5345 11.361 15.0831 9.91697L21.9961 6"
       variants={flapVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "6px" }}
      />
      <path d="M11.9961 20.5C11.0306 20.5 10.0652 20.4878 9.09492 20.4634C5.94643 20.3843 4.37218 20.3448 3.24105 19.2094C2.10992 18.0739 2.07723 16.5412 2.01186 13.4756C1.99084 12.4899 1.99084 11.5101 2.01186 10.5244C2.07723 7.45885 2.10992 5.92608 3.24105 4.79065C4.37218 3.65521 5.94642 3.61566 9.09492 3.53656C11.0354 3.48781 12.9568 3.48781 14.8973 3.53657C18.0458 3.61568 19.62 3.65523 20.7511 4.79066C21.8823 5.92609 21.915 7.45886 21.9803 10.5244C21.9837 10.6831 21.9866 10.8416 21.9888 11" />
      <m.path
       d="M14.9961 18.3333C14.9961 18.3333 15.8711 18.3333 16.7461 20C16.7461 20 19.5255 15.8333 21.9961 15"
       strokeDasharray="12"
       strokeDashoffset="0"
       variants={tickVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MailCheckIcon.displayName = "MailCheckIcon";
export { MailCheckIcon };
