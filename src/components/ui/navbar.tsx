import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type NavbarProps = HTMLAttributes<HTMLDivElement>;

const Navbar = forwardRef<HTMLDivElement, NavbarProps>(
  ({ className, ...props }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          "flex items-center justify-between h-14 px-10 bg-[#0A0A0A] border-b border-[#2A2A2A]",
          className,
        )}
        {...props}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-mono text-[#10B981]">
            &gt;
          </span>
          <span className="text-lg font-medium font-mono text-[#FAFAFA]">
            devroast
          </span>
        </div>
        <a
          href="/leaderboard"
          className="text-sm font-mono text-[#6B7280] hover:text-[#FAFAFA] transition-colors"
        >
          leaderboard
        </a>
      </nav>
    );
  },
);

Navbar.displayName = "Navbar";

export { Navbar };
