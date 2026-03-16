"use client";

import { trpc } from '@/trpc/client';
import { cn } from '@/lib/utils';

function MetricsSkeleton() {
  return (
    <div className="flex items-center gap-8">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono text-[#4B5563] uppercase tracking-wider">
          Total Roasted
        </span>
        <div className="h-9 w-24 bg-[#2A2A2A] rounded animate-pulse" />
      </div>
      <div className="w-px h-10 bg-[#2A2A2A]" />
      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono text-[#4B5563] uppercase tracking-wider">
          Avg Score
        </span>
        <div className="h-9 w-16 bg-[#2A2A2A] rounded animate-pulse" />
      </div>
    </div>
  );
}

interface MetricsSectionProps {
  className?: string;
}

export function MetricsSection({ className }: MetricsSectionProps) {
  const { data: metrics, isLoading } = trpc.metrics.getMetrics.useQuery(undefined, {
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return <MetricsSkeleton />;
  }

  return (
    <div className={cn('', className)}>
      <div className="flex items-center gap-8">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono text-[#4B5563] uppercase tracking-wider">
            Total Roasted
          </span>
          <span className="text-3xl font-bold font-mono text-[#FAFAFA]">
            {metrics?.totalRoasts.toLocaleString() ?? '--'}
          </span>
        </div>
        <div className="w-px h-10 bg-[#2A2A2A]" />
        <div className="flex flex-col gap-1">
          <span className="text-xs font-mono text-[#4B5563] uppercase tracking-wider">
            Avg Score
          </span>
          <span className="text-3xl font-bold font-mono text-[#F59E0B]">
            {metrics?.avgScore ?? '--'}
            <span className="text-lg text-[#4B5563]">/10</span>
          </span>
        </div>
      </div>
    </div>
  );
}
