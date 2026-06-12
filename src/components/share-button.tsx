"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

export function ShareButton({
  submissionId,
  className,
}: {
  submissionId: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(async () => {
    const url = `${window.location.origin}/results/${submissionId}/opengraph-image`;

    if (navigator.share) {
      try {
        await navigator.share({ url });
      } catch {
        // user cancelled
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  }, [submissionId]);

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-md border font-mono text-xs text-[#FAFAFA] bg-transparent border-[#2A2A2A] enabled:hover:bg-[#1A1A1A] enabled:active:bg-[#222] transition-colors",
        className,
      )}
    >
      {copied ? "$ link_copied!" : "$ share_roast"}
    </button>
  );
}
