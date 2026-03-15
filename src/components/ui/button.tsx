import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-mono text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-emerald-500 text-neutral-950 enabled:hover:bg-emerald-600",
        destructive: "bg-red-500 text-white enabled:hover:bg-red-600",
        outline:
          "border border-neutral-200 bg-transparent enabled:hover:bg-neutral-100 text-neutral-900",
        secondary:
          "bg-neutral-100 text-neutral-900 enabled:hover:bg-neutral-200",
        ghost: "enabled:hover:bg-neutral-100 text-neutral-900",
        link: "text-emerald-500 underline-offset-4 enabled:hover:underline",
      },
      size: {
        default: "px-6 py-2.5",
        sm: "px-3 py-1.5 text-xs",
        lg: "px-8 py-3 text-base",
        icon: "px-2.5 py-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export { Button, buttonVariants };
