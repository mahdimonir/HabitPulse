'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';
import { formatDateKey, subDays } from '@/lib/dateUtils';

interface HeatmapProps {
  checkInDates: string[];
  onToggleDate?: (dateStr: string) => void;
  interactive?: boolean;
}

export function Heatmap({ checkInDates, onToggleDate, interactive = true }: HeatmapProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateSet = useMemo(() => new Set(checkInDates), [checkInDates]);

  const { grid } = useMemo(() => {
    const today = new Date();
    const totalDays = 365;
    const days: { dateStr: string; dateObj: Date; dayOfWeek: number; completed: boolean; isFuture: boolean }[] = [];

    for (let i = totalDays - 1; i >= 0; i--) {
      const dateObj = subDays(today, i);
      const dateStr = formatDateKey(dateObj);
      days.push({
        dateStr,
        dateObj,
        dayOfWeek: dateObj.getDay(),
        completed: dateSet.has(dateStr),
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
              completed: false,
              isFuture: true,
            });
          }
        }
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return { grid: weeks };
  }, [dateSet]);

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
  }, [checkInDates]);

  const todayStr = formatDateKey(new Date());

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-800">
          <Calendar className="h-4 w-4 text-slate-600" />
          <span>365-Day Contribution Calendar</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 self-start sm:self-auto">
          <span>Less</span>
          <span className="h-3 w-3 rounded-sm border border-slate-200 bg-slate-100" />
          <span className="h-3 w-3 rounded-sm bg-emerald-200 border border-emerald-300" />
          <span className="h-3 w-3 rounded-sm bg-emerald-500 border border-emerald-600" />
          <span>More</span>
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
                        <button
                          key={day.dateStr}
                          disabled={!interactive || !onToggleDate}
                          onClick={() => onToggleDate && onToggleDate(day.dateStr)}
                          title={`${day.dateStr} ${isToday ? '(Today)' : ''}: ${day.completed ? 'Completed' : 'Missed'}`}
                          className={`group relative h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-sm transition-all duration-150 focus:outline-none ${
                            day.completed
                              ? 'bg-emerald-500 border border-emerald-600 hover:bg-emerald-600'
                              : 'bg-slate-100 border border-slate-200 hover:border-slate-400'
                          } ${isToday ? 'ring-2 ring-slate-900 ring-offset-1 ring-offset-white' : ''}`}
                        >
                          <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] font-medium text-white shadow-lg group-hover:block z-20 border border-slate-800">
                            {day.dateStr} {isToday && '· Today'}: {day.completed ? 'Completed' : 'Missed'}
                          </span>
                        </button>
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
