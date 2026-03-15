import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-lg border border-[#2A2A2A] bg-[#0F0F0F]", {
  variants: {
    padding: {
      default: "p-5",
      sm: "p-4",
      lg: "p-6",
      none: "p-0",
    },
  },
  defaultVariants: {
    padding: "default",
  },
});

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ padding }), className)}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      />
    );
  },
);

CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={cn("font-mono text-sm text-[#FAFAFA]", className)}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn(
        "font-mono text-xs text-[#6B7280] leading-relaxed",
        className,
      )}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";

export { Card, CardHeader, CardTitle, CardDescription, cardVariants };
