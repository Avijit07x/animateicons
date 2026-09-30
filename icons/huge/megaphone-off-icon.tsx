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
export interface MegaphoneOffIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface MegaphoneOffIconProps extends Omit<
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

const MegaphoneOffIcon = forwardRef<
 MegaphoneOffIconHandle,
 MegaphoneOffIconProps
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
    strokeDashoffset: [29, 0],
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
       <path d="M10.5703 6.5L14.9221 4.41103C16.4493 3.67794 17.2129 3.3114 18.0642 3.5971C18.9156 3.88281 19.2078 4.49586 19.7922 5.72196C21.1971 8.66932 21.3721 11.9657 20.3174 15" />
       <path d="M7.49609 7.83269C7.21995 7.86593 6.93778 7.85078 6.65284 7.78695C6.28786 7.70519 6.10535 7.66431 5.9584 7.64752C4.13352 7.43913 2.99609 8.88344 2.99609 10.5443V11.4558C2.99609 13.1166 4.13352 14.5609 5.9584 14.3525C6.10535 14.3357 6.28787 14.2948 6.65284 14.2131C7.21053 14.0882 7.7576 14.1497 8.26962 14.3955L14.9223 17.589C16.4495 18.3221 17.2131 18.6886 18.0645 18.4029" />
       <path d="M12.9961 17V17.5C12.9961 18.7841 12.9961 19.4261 12.7721 19.7886C12.4734 20.2719 11.9272 20.545 11.3614 20.4939C10.937 20.4557 10.4234 20.0704 9.39609 19.3L8.19609 18.4C7.21863 17.6669 6.99609 17.2218 6.99609 16V14.5" />
       <path d="M7.49609 14V8" />
      </m.g>
      <m.path
       d="M1.99609 2L21.9961 22"
       strokeDasharray="29"
       strokeDashoffset="0"
       variants={slashVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

MegaphoneOffIcon.displayName = "MegaphoneOffIcon";
export { MegaphoneOffIcon };
