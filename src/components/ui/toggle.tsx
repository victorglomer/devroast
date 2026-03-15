"use client";

import { Switch } from "@base-ui/react/switch";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, checked, onChange, label, disabled }, ref) => {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-3 font-mono text-xs transition-colors",
          checked ? "text-emerald-500" : "text-neutral-400",
          disabled && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <Switch.Root
          ref={ref}
          checked={checked}
          onCheckedChange={onChange}
          disabled={disabled}
          className={cn(
            "relative inline-flex h-[22px] w-[40px] items-center rounded-full p-[3px] transition-colors",
            checked ? "bg-emerald-500" : "bg-neutral-800",
          )}
        >
          <Switch.Thumb
            className={cn(
              "relative h-[16px] w-[16px] rounded-full bg-white transition-transform",
              checked ? "translate-x-[18px]" : "translate-x-0",
            )}
          />
        </Switch.Root>
        {label && <span>{label}</span>}
      </span>
    );
  },
);

Toggle.displayName = "Toggle";

export { Toggle };
