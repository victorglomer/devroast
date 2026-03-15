import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ScoreRingProps extends HTMLAttributes<HTMLDivElement> {
  score: number;
  maxScore?: number;
  size?: number;
}

function scoreGradientId(score: number) {
  return `score-gradient-${score.toString().replace(".", "-")}`;
}

const ScoreRing = forwardRef<HTMLDivElement, ScoreRingProps>(
  ({ className, score, maxScore = 10, size = 180, ...props }, ref) => {
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const ratio = Math.min(score / maxScore, 1);
    const filled = circumference * ratio;
    const gap = circumference - filled;
    const gradientId = scoreGradientId(score);

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex items-center justify-center",
          className,
        )}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 -rotate-90"
          role="img"
          aria-label={`Score: ${score} out of ${maxScore}`}
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2A2A2A"
            strokeWidth={strokeWidth}
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={`${filled} ${gap}`}
            strokeLinecap="round"
          />
        </svg>

        <div className="flex items-end gap-0.5">
          <span className="font-mono text-5xl font-bold text-[#FAFAFA] leading-none">
            {score % 1 === 0 ? score.toFixed(1) : score.toString()}
          </span>
          <span className="font-mono text-base text-[#4B5563] leading-none mb-1">
            /{maxScore}
          </span>
        </div>
      </div>
    );
  },
);

ScoreRing.displayName = "ScoreRing";

export { ScoreRing };
