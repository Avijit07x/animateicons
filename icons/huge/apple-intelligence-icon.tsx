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
export interface AppleIntelligenceIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface AppleIntelligenceIconProps extends Omit<
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

const AppleIntelligenceIcon = forwardRef<
 AppleIntelligenceIconHandle,
 AppleIntelligenceIconProps
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

  const wobbleVariants: Variants = {
   normal: { rotate: 0, scale: 1, transition: { duration: 0 } },
   animate: {
    rotate: [0, -14, 10, -5, 0],
    scale: [1, 0.88, 1, 0.98, 1],
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
      <m.path
       d="M17.3702 16.2713L20.465 15.2776C21.5834 14.9184 21.8652 13.4928 20.9647 12.749L18.5414 10.7472M17.3702 16.2713L15.6246 16.8319C14.8533 17.0796 14.1247 17.441 13.464 17.9038L12.1229 18.8432M17.3702 16.2713L17.4325 14.7768C17.4671 13.9453 17.636 13.1245 17.9329 12.345L18.5414 10.7472M17.3702 16.2713L17.2401 19.3942C17.193 20.5254 15.9184 21.1841 14.942 20.5819L12.1229 18.8432M12.1229 18.8432L9.43738 20.7242C8.50033 21.3805 7.19058 20.7997 7.07263 19.6754L6.74168 16.5208M12.1229 18.8432L10.5594 17.8788C9.87224 17.455 9.12342 17.1362 8.33865 16.9335L6.74168 16.5208M6.74168 16.5208L3.61989 15.7141C2.48271 15.4203 2.11569 14.0149 2.96854 13.22L5.2878 11.0584M6.74168 16.5208L6.43349 13.5832L5.2878 11.0584M5.2878 11.0584L4.00706 8.23589C3.53226 7.18955 4.40146 6.03466 5.55954 6.17312L8.85203 6.56678M5.2878 11.0584L6.58864 9.84595C7.1925 9.28313 7.70325 8.63126 8.10245 7.91385L8.85203 6.56678M8.85203 6.56678L10.4099 3.76716C10.9595 2.7795 12.3882 2.73674 12.998 3.68971L14.7505 6.42828M8.85203 6.56678L10.7141 6.78942C11.5126 6.88489 12.3213 6.86164 13.1127 6.72045L14.7505 6.42828M14.7505 6.42828L17.9828 5.85166C19.1288 5.64722 20.0649 6.74666 19.657 7.81789L18.5414 10.7472M14.7505 6.42828L15.6961 7.90606C16.1377 8.59606 16.6858 9.21445 17.3209 9.73905L18.5414 10.7472"
       variants={wobbleVariants}
       style={{ transformBox: "view-box", originX: "12px", originY: "12px" }}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

AppleIntelligenceIcon.displayName = "AppleIntelligenceIcon";
export { AppleIntelligenceIcon };
