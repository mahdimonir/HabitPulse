'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Habit } from '@/types';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Check, Flame, MoreVertical, Archive, Trash2, Edit3, BarChart2, Tag } from 'lucide-react';

interface HabitCardProps {
  habit: Habit;
  onToggleCheckIn: (habitId: string) => Promise<void>;
  onEdit: (habit: Habit) => void;
  onArchiveToggle: (habit: Habit) => Promise<void>;
  onDelete: (habitId: string) => Promise<void>;
}

export function HabitCard({
  habit,
  onToggleCheckIn,
  onEdit,
  onArchiveToggle,
  onDelete,
}: HabitCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showUncheckConfirm, setShowUncheckConfirm] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const executeToggle = async () => {
    try {
      setIsToggling(true);
      await onToggleCheckIn(habit.id);
    } finally {
      setIsToggling(false);
    }
  };

  const handleQuickToggle = async () => {
    if (habit.todayCompleted) {
      setShowUncheckConfirm(true);
    } else {
      await executeToggle();
    }
  };

  return (
    <>
      <div
        className={`group relative flex flex-col justify-between rounded-xl border transition-all duration-200 p-4 sm:p-5 ${
          habit.archived
            ? 'border-slate-200 bg-slate-100/50 opacity-70'
            : habit.todayCompleted
            ? 'border-slate-200 bg-slate-50/60 opacity-90 hover:opacity-100'
            : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm hover:shadow-md ring-1 ring-slate-900/5'
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700">
                  <Tag className="h-2.5 w-2.5" />
                  {habit.category || 'General'}
                </span>
                {habit.archived && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-800">
                    Archived
                  </span>
                )}
                {!habit.todayCompleted && !habit.archived && (
                  <span className="rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
                    Pending Today
                  </span>
                )}
              </div>

              <Link
                href={`/habits/${habit.id}`}
                className="text-base font-bold text-slate-900 hover:underline flex items-center gap-2 group-hover:text-slate-800"
              >
                <span>{habit.title}</span>
              </Link>

              {habit.description && (
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {habit.description}
                </p>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <MoreVertical className="h-4 w-4" />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 z-20 mt-1 w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-xl">
                    <Link
                      href={`/habits/${habit.id}`}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <BarChart2 className="h-3.5 w-3.5" />
                      <span>View Analytics</span>
                    </Link>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        onEdit(habit);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit Habit</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowArchiveConfirm(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Archive className="h-3.5 w-3.5" />
                      <span>{habit.archived ? 'Unarchive' : 'Archive'}</span>
                    </button>
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <div className="flex items-center gap-1.5">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full ${
                  habit.currentStreak > 0
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                <Flame className="h-3.5 w-3.5 fill-current" />
              </div>
              <div>
                <span className="text-sm font-extrabold text-slate-900">{habit.currentStreak}</span>
                <span className="ml-1 text-[11px] font-medium text-slate-500">day streak</span>
              </div>
            </div>

            <div className="text-right text-[11px] text-slate-500">
              <span>Best: </span>
              <span className="font-semibold text-slate-800">{habit.longestStreak} days</span>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-medium">
              <span>90-Day Rate</span>
              <span>{habit.completionRate90Days}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${habit.completionRate90Days}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <button
            onClick={handleQuickToggle}
            disabled={habit.archived || isToggling}
            className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 px-4 text-xs font-bold transition-all active:scale-[0.98] ${
              habit.todayCompleted
                ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                : 'border border-slate-200 bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
            } disabled:opacity-50`}
          >
            {isToggling ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : habit.todayCompleted ? (
              <>
                <Check className="h-4 w-4 stroke-[3]" />
                <span>Completed Today</span>
              </>
            ) : (
              <span>Mark Done for Today</span>
            )}
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showUncheckConfirm}
        onClose={() => setShowUncheckConfirm(false)}
        onConfirm={executeToggle}
        title="Uncheck Completed Habit"
        message={`Are you sure you want to remove today's completed check-in for "${habit.title}"? Your streak count will be updated.`}
        confirmText="Remove Check-in"
        confirmVariant="warning"
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => onDelete(habit.id)}
        title="Delete Habit"
        message={`Are you sure you want to delete "${habit.title}"? All associated check-in history and streak statistics will be permanently removed.`}
        confirmText="Delete Habit"
        confirmVariant="danger"
      />

      <ConfirmModal
        isOpen={showArchiveConfirm}
        onClose={() => setShowArchiveConfirm(false)}
        onConfirm={() => onArchiveToggle(habit)}
        title={habit.archived ? 'Unarchive Habit' : 'Archive Habit'}
        message={
          habit.archived
            ? `Do you want to restore "${habit.title}" to active habits?`
            : `Are you sure you want to archive "${habit.title}"? It will be hidden from your daily active list but historical data will be preserved.`
        }
        confirmText={habit.archived ? 'Unarchive' : 'Archive'}
        confirmVariant="warning"
      />
    </>
  );
}
