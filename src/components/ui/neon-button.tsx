import React from "react";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
  "relative group border text-foreground mx-auto text-center rounded-full transition-all duration-200 cursor-none",
  {
    variants: {
      variant: {
        default:
          "bg-[rgba(254,254,254,0.05)] hover:bg-[rgba(254,254,254,0.02)] border-[rgba(254,254,254,0.12)]",
        solid:
          "bg-[#fefefe] hover:bg-[#e0e0e0] text-[#0e0e00] border-transparent font-semibold",
        ghost:
          "border-transparent bg-transparent hover:border-[rgba(254,254,254,0.2)] hover:bg-[rgba(254,254,254,0.05)]",
      },
      size: {
        default: "px-7 py-1.5 text-sm",
        sm: "px-4 py-0.5 text-xs",
        lg: "px-10 py-2.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface NeonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  neon?: boolean;
}

const NeonButton = React.forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, neon = true, size, variant, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {/* Top neon edge */}
        <span
          className={cn(
            "absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-[#fefefe] to-transparent hidden",
            neon && "block"
          )}
        />
        {children}
        {/* Bottom neon edge */}
        <span
          className={cn(
            "absolute group-hover:opacity-40 opacity-20 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-[#fefefe] to-transparent hidden",
            neon && "block"
          )}
        />
      </button>
    );
  }
);

NeonButton.displayName = "NeonButton";

export { NeonButton, buttonVariants };
