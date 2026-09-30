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
export interface Briefcase01IconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface Briefcase01IconProps extends Omit<
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

const Briefcase01Icon = forwardRef<Briefcase01IconHandle, Briefcase01IconProps>(
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

  const handleVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, -2, 0.3, 0],
    transition: {
     duration: 0.5 * duration,
     ease: "easeInOut",
    },
   },
  };

  const claspVariants: Variants = {
   normal: { y: 0 },
   animate: {
    y: [0, 1.3, 0],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: 0.15 * duration,
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
      <path d="M2.00127 8.5L1.99911 13.997C1.99782 17.2979 1.99717 18.9484 3.02235 19.974C4.04754 20.9996 5.69801 20.9996 8.99895 20.9997L15 20.9998C18.2994 20.9999 19.949 21 20.9741 19.9751C21.9992 18.9502 21.9996 17.3005 22.0002 14.0012L22.0013 8.5" />
      <m.path
       d="M8.49857 6.5C8.49857 5.09554 8.49857 4.39331 8.83563 3.88886C8.98154 3.67048 9.16904 3.48298 9.38743 3.33706C9.89187 3 10.5941 3 11.9986 3C13.403 3 14.1053 3 14.6097 3.33706C14.8281 3.48298 15.0156 3.67048 15.1615 3.88886C15.4986 4.39331 15.4986 5.09554 15.4986 6.5"
       variants={handleVariants}
      />
      <path d="M19.998 6.50016L3.99885 6.5C2.8944 6.50007 1.99876 7.39568 1.99866 8.50013C1.99876 10.7091 3.79005 12.5004 5.99901 12.5006H17.9978C20.2068 12.5005 21.998 10.7093 21.9981 8.5003C21.998 7.39582 21.1024 6.50023 19.998 6.50016Z" />
      <m.path
       d="M9.99857 12.5V13.5C9.99857 13.965 9.99857 14.1975 10.0497 14.3882C10.1884 14.9059 10.5927 15.3102 11.1103 15.4489C11.3011 15.5 11.5336 15.5 11.9986 15.5C12.4636 15.5 12.696 15.5 12.8868 15.4489C13.4044 15.3102 13.8088 14.9059 13.9475 14.3882C13.9986 14.1975 13.9986 13.965 13.9986 13.5V12.5"
       variants={claspVariants}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

Briefcase01Icon.displayName = "Briefcase01Icon";
export { Briefcase01Icon };
