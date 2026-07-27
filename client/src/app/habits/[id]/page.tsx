'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Habit } from '@/types';
import { Navbar } from '@/components/Navbar';
import { Heatmap } from '@/components/Heatmap';
import { HabitModal } from '@/components/HabitModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { HeatmapSkeleton, StatCardSkeleton } from '@/components/Skeletons';
import { toast } from 'sonner';
import { ArrowLeft, Flame, Trophy, Calendar, CheckCircle2, Edit3, Trash2, Archive, Check, Award, Tag } from 'lucide-react';

export default function HabitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const habitId = resolvedParams.id;

  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchHabitDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/habits/${habitId}`);
      setHabit(res.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load habit detail');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && habitId) {
      fetchHabitDetail();
    }
  }, [user, habitId]);

  const handleToggleCheckInDate = async (dateStr?: string) => {
    if (!habit || toggleLoading) return;
    try {
      setToggleLoading(true);
      const res = await api.post(`/habits/${habit.id}/checkin`, { date: dateStr });
      const { isCompleted, habit: updatedHabit, date } = res.data;

      setHabit(updatedHabit);

      if (isCompleted) {
        toast.success(`Check-in recorded for ${date}`);
      } else {
        toast.info(`Check-in removed for ${date}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to toggle check-in');
    } finally {
      setToggleLoading(false);
    }
  };

  const handleSaveHabit = async (title: string, description?: string, category?: string) => {
    if (!habit) return;
    try {
      await api.patch(`/habits/${habit.id}`, { title, description, category });
      setHabit((prev) => (prev ? { ...prev, title, description, category: category || 'General' } : null));
      toast.success('Habit updated successfully');
      setIsEditModalOpen(false);
    } catch (error: any) {
      toast.error('Failed to update habit');
    }
  };

  const handleArchiveToggle = async () => {
    if (!habit) return;
    try {
      const updatedArchived = !habit.archived;
      await api.patch(`/habits/${habit.id}`, { archived: updatedArchived });
      setHabit((prev) => (prev ? { ...prev, archived: updatedArchived } : null));
      toast.success(updatedArchived ? 'Habit archived' : 'Habit unarchived');
    } catch (error: any) {
      toast.error('Failed to archive habit');
    }
  };

  const handleDeleteHabit = async () => {
    if (!habit) return;
    try {
      await api.delete(`/habits/${habit.id}`);
      toast.success('Habit deleted');
      router.push('/');
    } catch (error: any) {
      toast.error('Failed to delete habit');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
          <div className="mb-6 h-4 w-32 rounded bg-slate-200 animate-pulse" />
          <div className="mb-6 h-36 w-full rounded-2xl bg-slate-200 animate-pulse" />
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
          <HeatmapSkeleton />
        </main>
      </div>
    );
  }

  if (!habit) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  <Tag className="h-3 w-3" />
                  {habit.category || 'General'}
                </span>
                {habit.archived && (
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    Archived
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-black tracking-tight text-slate-900">{habit.title}</h1>

              {habit.description && (
                <p className="mt-2 text-sm text-slate-500 max-w-2xl leading-relaxed">
                  {habit.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleCheckInDate()}
                disabled={habit.archived || toggleLoading}
                className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition active:scale-[0.98] ${
                  habit.todayCompleted
                    ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                    : 'border border-slate-200 bg-slate-100 text-slate-900 hover:bg-slate-200'
                } disabled:opacity-50`}
              >
                {toggleLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : habit.todayCompleted ? (
                  <>
                    <Check className="h-4 w-4 stroke-[3]" />
                    <span>Done Today</span>
                  </>
                ) : (
                  <span>Check In Today</span>
                )}
              </button>

              <button
                onClick={() => setIsEditModalOpen(true)}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition"
                title="Edit Habit"
              >
                <Edit3 className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowArchiveConfirm(true)}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition"
                title={habit.archived ? 'Unarchive Habit' : 'Archive Habit'}
              >
                <Archive className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition"
                title="Delete Habit"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <Award className="h-4 w-4 text-slate-700" />
            <span>Streak Milestones & Achievements</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`flex items-center gap-2.5 rounded-xl border p-3 ${habit.longestStreak >= 7 ? 'border-emerald-200 bg-emerald-50/50 text-emerald-900' : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'}`}>
              <Flame className={`h-5 w-5 ${habit.longestStreak >= 7 ? 'fill-emerald-500 text-emerald-500' : ''}`} />
              <div>
                <div className="text-xs font-bold">7-Day Streak</div>
                <div className="text-[10px]">{habit.longestStreak >= 7 ? 'Unlocked' : 'Reach 7 days'}</div>
              </div>
            </div>

            <div className={`flex items-center gap-2.5 rounded-xl border p-3 ${habit.longestStreak >= 30 ? 'border-indigo-200 bg-indigo-50/50 text-indigo-900' : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'}`}>
              <Trophy className={`h-5 w-5 ${habit.longestStreak >= 30 ? 'text-indigo-600' : ''}`} />
              <div>
                <div className="text-xs font-bold">30-Day Master</div>
                <div className="text-[10px]">{habit.longestStreak >= 30 ? 'Unlocked' : 'Reach 30 days'}</div>
              </div>
            </div>

            <div className={`flex items-center gap-2.5 rounded-xl border p-3 ${habit.longestStreak >= 90 ? 'border-purple-200 bg-purple-50/50 text-purple-900' : 'border-slate-200 bg-slate-50 text-slate-400 opacity-60'}`}>
              <Award className={`h-5 w-5 ${habit.longestStreak >= 90 ? 'text-purple-600' : ''}`} />
              <div>
                <div className="text-xs font-bold">90-Day Legend</div>
                <div className="text-[10px]">{habit.longestStreak >= 90 ? 'Unlocked' : 'Reach 90 days'}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Current Streak</span>
              <Flame className="h-4 w-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">{habit.currentStreak} <span className="text-xs font-normal text-slate-500">days</span></div>
            <div className="mt-1 text-[10px] text-slate-500">Ongoing streak</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Longest Streak</span>
              <Trophy className="h-4 w-4 text-slate-700" />
            </div>
            <div className="text-2xl font-black text-slate-900">{habit.longestStreak} <span className="text-xs font-normal text-slate-500">days</span></div>
            <div className="mt-1 text-[10px] text-slate-500">All-time record</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">Total Check-ins</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">{habit.totalCheckIns}</div>
            <div className="mt-1 text-[10px] text-slate-500">Total days completed</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold">90-Day Rate</span>
              <Calendar className="h-4 w-4 text-slate-700" />
            </div>
            <div className="text-2xl font-black text-slate-900">{habit.completionRate90Days}%</div>
            <div className="mt-1 text-[10px] text-slate-500">Consistency score</div>
          </div>
        </div>

        <div className="mb-8">
          <Heatmap
            checkInDates={habit.checkInDates}
            onToggleDate={(dateStr) => handleToggleCheckInDate(dateStr)}
            interactive={!habit.archived}
          />
          <p className="mt-2 text-[11px] text-slate-500 text-center">
            Click on any day cell in the heatmap grid above to mark or unmark historical check-in dates.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-600" />
            <span>Check-in History ({habit.checkInDates.length} entries)</span>
          </h3>

          {habit.checkInDates.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No check-ins recorded yet. Click &quot;Check In Today&quot; or select a date in the heatmap above.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {habit.checkInDates.map((dateStr) => (
                <div
                  key={dateStr}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800"
                >
                  <span className="font-mono">{dateStr}</span>
                  <button
                    onClick={() => handleToggleCheckInDate(dateStr)}
                    className="text-slate-400 hover:text-rose-600 transition"
                    title="Remove check-in"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <HabitModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveHabit}
        initialData={habit}
      />

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteHabit}
        title="Delete Habit"
        message={`Are you sure you want to delete "${habit.title}"? All associated check-in history and streak statistics will be permanently removed.`}
        confirmText="Delete Habit"
        confirmVariant="danger"
      />

      <ConfirmModal
        isOpen={showArchiveConfirm}
        onClose={() => setShowArchiveConfirm(false)}
        onConfirm={handleArchiveToggle}
        title={habit.archived ? 'Unarchive Habit' : 'Archive Habit'}
        message={
          habit.archived
            ? `Do you want to restore "${habit.title}" to active habits?`
            : `Are you sure you want to archive "${habit.title}"? It will be hidden from your daily active list but historical data will be preserved.`
        }
        confirmText={habit.archived ? 'Unarchive' : 'Archive'}
        confirmVariant="warning"
      />
    </div>
  );
}
