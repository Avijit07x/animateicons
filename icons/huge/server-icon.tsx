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
export interface ServerIconHandle {
 startAnimation: () => void;
 stopAnimation: () => void;
}

interface ServerIconProps extends Omit<
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

const ServerIcon = forwardRef<ServerIconHandle, ServerIconProps>(
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

  const blinkVariants = (delay: number): Variants => ({
   normal: { opacity: 1 },
   animate: {
    opacity: [1, 0.1, 1],
    transition: {
     duration: 0.4 * duration,
     ease: "easeInOut",
     delay: delay * duration,
    },
   },
  });

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
      <path d="M1.99219 7.99988C1.99219 6.11426 1.99219 5.17145 2.57797 4.58566C3.16376 3.99988 4.10657 3.99988 5.99219 3.99988H17.9922C19.8778 3.99988 20.8206 3.99988 21.4064 4.58566C21.9922 5.17145 21.9922 6.11426 21.9922 7.99988C21.9922 9.8855 21.9922 10.8283 21.4064 11.4141C20.8206 11.9999 19.8778 11.9999 17.9922 11.9999H5.99219C4.10657 11.9999 3.16376 11.9999 2.57797 11.4141C1.99219 10.8283 1.99219 9.8855 1.99219 7.99988Z" />
      <path d="M1.99219 16C1.99219 14.1143 1.99219 13.1714 2.57798 12.5856C3.16378 11.9998 4.10659 11.9999 5.99223 11.9999L17.9922 12C19.8778 12 20.8206 12 21.4064 12.5858C21.9922 13.1716 21.9922 14.1144 21.9922 16C21.9922 17.8857 21.9922 18.8285 21.4064 19.4143C20.8206 20.0001 19.8778 20.0001 17.9922 20.0001H5.99219C4.10657 20.0001 3.16376 20.0001 2.57797 19.4143C1.99219 18.8285 1.99219 17.8857 1.99219 16Z" />
      <m.path
       d="M6.11719 7.99988H5.99219M6.24219 7.99988C6.24219 8.13795 6.13026 8.24988 5.99219 8.24988C5.85412 8.24988 5.74219 8.13795 5.74219 7.99988C5.74219 7.86181 5.85412 7.74988 5.99219 7.74988C6.13026 7.74988 6.24219 7.86181 6.24219 7.99988Z"
       variants={blinkVariants(0)}
      />
      <m.path
       d="M10.1172 7.99988H9.99219M10.2422 7.99988C10.2422 8.13795 10.1303 8.24988 9.99219 8.24988C9.85412 8.24988 9.74219 8.13795 9.74219 7.99988C9.74219 7.86181 9.85412 7.74988 9.99219 7.74988C10.1303 7.74988 10.2422 7.86181 10.2422 7.99988Z"
       variants={blinkVariants(0.15)}
      />
      <m.path
       d="M6.11719 15.9999H5.99219M6.24219 15.9999C6.24219 16.1379 6.13026 16.2499 5.99219 16.2499C5.85412 16.2499 5.74219 16.1379 5.74219 15.9999C5.74219 15.8618 5.85412 15.7499 5.99219 15.7499C6.13026 15.7499 6.24219 15.8618 6.24219 15.9999Z"
       variants={blinkVariants(0.3)}
      />
      <m.path
       d="M10.1172 15.9999H9.99219M10.2422 15.9999C10.2422 16.1379 10.1303 16.2499 9.99219 16.2499C9.85412 16.2499 9.74219 16.1379 9.74219 15.9999C9.74219 15.8618 9.85412 15.7499 9.99219 15.7499C10.1303 15.7499 10.2422 15.8618 10.2422 15.9999Z"
       variants={blinkVariants(0.45)}
      />
     </m.svg>
    </m.div>
   </LazyMotion>
  );
 },
);

ServerIcon.displayName = "ServerIcon";
export { ServerIcon };
