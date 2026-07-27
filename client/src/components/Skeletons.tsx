'use client';

import React from 'react';

export function StatCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="h-3 w-20 rounded bg-slate-200" />
        <div className="h-4 w-4 rounded-full bg-slate-200" />
      </div>
      <div className="h-7 w-12 rounded bg-slate-200" />
      <div className="mt-2 h-2.5 w-24 rounded bg-slate-100" />
    </div>
  );
}

export function HabitCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 rounded bg-slate-200" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
          </div>
          <div className="h-6 w-6 rounded bg-slate-200" />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-slate-200" />
            <div className="h-4 w-16 rounded bg-slate-200" />
          </div>
          <div className="h-3 w-16 rounded bg-slate-100" />
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex justify-between">
            <div className="h-2.5 w-12 rounded bg-slate-100" />
            <div className="h-2.5 w-8 rounded bg-slate-100" />
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-200" />
        </div>
      </div>

      <div className="mt-5">
        <div className="h-9 w-full rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

export function HeatmapSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-36 rounded bg-slate-200" />
        <div className="h-3 w-24 rounded bg-slate-100" />
      </div>
      <div className="h-28 w-full rounded bg-slate-100" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <HabitCardSkeleton />
        <HabitCardSkeleton />
        <HabitCardSkeleton />
      </div>
    </div>
  );
}
