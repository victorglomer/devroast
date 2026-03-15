import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-2 font-mono text-xs", {
  variants: {
    variant: {
      critical: "text-red-500",
      warning: "text-amber-500",
      good: "text-emerald-500",
      verdict: "text-red-500",
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

const badgeDotVariants = cva("rounded-full", {
  variants: {
    variant: {
      critical: "bg-red-500",
      warning: "bg-amber-500",
      good: "bg-emerald-500",
      verdict: "bg-red-500",
    },
  },
  defaultVariants: {
    variant: "good",
  },
});

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  showDot?: boolean;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, showDot = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      >
        {showDot && (
          <span className={cn(badgeDotVariants({ variant }), "h-2 w-2")} />
        )}
        {children}
      </div>
    );
  },
);

Badge.displayName = "Badge";

export { Badge, badgeVariants, badgeDotVariants };
