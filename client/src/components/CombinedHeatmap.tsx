'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import { Habit } from '@/types';
import { Activity } from 'lucide-react';
import { formatDateKey, subDays } from '@/lib/dateUtils';

interface CombinedHeatmapProps {
  habits: Habit[];
}

export function CombinedHeatmap({ habits }: CombinedHeatmapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const dailyCountsMap = useMemo(() => {
    const map = new Map<string, number>();

    habits.forEach((habit) => {
      if (habit.archived) return;
      habit.checkInDates.forEach((dateStr) => {
        const count = map.get(dateStr) || 0;
        map.set(dateStr, count + 1);
      });
    });

    return map;
  }, [habits]);

  const { grid, totalCheckInsYear } = useMemo(() => {
    const today = new Date();
    const totalDays = 365;
    const days: { dateStr: string; dateObj: Date; dayOfWeek: number; count: number; isFuture: boolean }[] = [];
    let countSum = 0;

    for (let i = totalDays - 1; i >= 0; i--) {
      const dateObj = subDays(today, i);
      const dateStr = formatDateKey(dateObj);
      const count = dailyCountsMap.get(dateStr) || 0;
      countSum += count;

      days.push({
        dateStr,
        dateObj,
        dayOfWeek: dateObj.getDay(),
        count,
        isFuture: false,
      });
    }

    const weeks: (typeof days)[] = [];
    let currentWeek: typeof days = [];

    days.forEach((day) => {
      currentWeek.push(day);
      if (day.dayOfWeek === 6 || days.indexOf(day) === days.length - 1) {
        if (days.indexOf(day) === days.length - 1 && currentWeek.length < 7) {
          const needed = 7 - currentWeek.length;
          for (let f = 1; f <= needed; f++) {
            const futureObj = new Date(today);
            futureObj.setDate(futureObj.getDate() + f);
            currentWeek.push({
              dateStr: formatDateKey(futureObj),
              dateObj: futureObj,
              dayOfWeek: futureObj.getDay(),
              count: 0,
              isFuture: true,
            });
          }
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return { grid: weeks, totalCheckInsYear: countSum };
  }, [dailyCountsMap]);

  const weekMonthHeaders = useMemo(() => {
    let lastMonth = '';
    return grid.map((week) => {
      const firstDay = week[0];
      const monthName = firstDay.dateObj.toLocaleString('default', { month: 'short' });
      if (monthName !== lastMonth) {
        lastMonth = monthName;
        return monthName;
      }
      return null;
    });
  }, [grid]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [habits]);

  const todayStr = formatDateKey(new Date());

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-slate-100 border border-slate-200/80 hover:border-slate-400';
    if (count === 1) return 'bg-emerald-200 border border-emerald-300 hover:bg-emerald-300';
    if (count === 2) return 'bg-emerald-400 border border-emerald-500 hover:bg-emerald-500';
    return 'bg-emerald-600 border border-emerald-700 text-white font-bold hover:bg-emerald-700';
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-900">
            <Activity className="h-4 w-4 text-emerald-600" />
            <span>Combined Activity Contribution Grid (365 Days)</span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Aggregated check-in intensity across all active habits in the past year.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full text-xs">
            <span>{totalCheckInsYear} Total Check-ins in 2026</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>Less</span>
            <span className="h-3 w-3 rounded-sm border border-slate-200 bg-slate-100" />
            <span className="h-3 w-3 rounded-sm bg-emerald-200" />
            <span className="h-3 w-3 rounded-sm bg-emerald-400" />
            <span className="h-3 w-3 rounded-sm bg-emerald-600" />
            <span>More</span>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="w-full overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-300 scroll-smooth"
      >
        <div className="inline-block min-w-max">
          <div className="flex gap-2">
            <div className="flex flex-col justify-between text-[10px] font-medium text-slate-500 pt-5 pb-0.5 pr-1">
              <span>Sun</span>
              <span>Tue</span>
              <span>Thu</span>
              <span>Sat</span>
            </div>

            <div className="flex gap-[3px] sm:gap-1">
              {grid.map((week, wIdx) => {
                const monthLabel = weekMonthHeaders[wIdx];

                return (
                  <div key={wIdx} className="flex flex-col gap-[3px] sm:gap-1">
                    <div className="h-4 text-[10px] font-medium text-slate-500 relative whitespace-nowrap overflow-visible">
                      {monthLabel && (
                        <span className="absolute left-0 top-0 select-none">
                          {monthLabel}
                        </span>
                      )}
                    </div>

                    {week.map((day) => {
                      const isToday = day.dateStr === todayStr;

                      if (day.isFuture) {
                        return (
                          <div
                            key={day.dateStr}
                            title={`${day.dateStr} (Upcoming)`}
                            className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-sm border border-dashed border-slate-200 bg-slate-50/50"
                          />
                        );
                      }

                      return (
                        <div
                          key={day.dateStr}
                          title={`${day.dateStr} ${isToday ? '(Today)' : ''}: ${day.count} check-in(s)`}
                          className={`group relative h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-sm transition-all duration-150 ${getIntensityClass(
                            day.count
                          )} ${isToday ? 'ring-2 ring-slate-900 ring-offset-1 ring-offset-white' : ''}`}
                        >
                          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg group-hover:block z-20 border border-slate-800">
                            {day.dateStr} {isToday && '· Today'}: {day.count} check-in(s)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
