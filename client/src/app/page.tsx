'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Habit } from '@/types';
import { Navbar } from '@/components/Navbar';
import { HabitCard } from '@/components/HabitCard';
import { HabitModal } from '@/components/HabitModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { CombinedHeatmap } from '@/components/CombinedHeatmap';
import { DashboardSkeleton } from '@/components/Skeletons';
import { toast } from 'sonner';
import { CheckCircle2, Trophy, Search, Plus, Sparkles, ArrowUpDown, Filter, CheckCheck, Award, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [allHabits, setAllHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'active' | 'completed' | 'archived' | 'all'>('active');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'pending' | 'streak' | 'rate' | 'newest' | 'title'>('pending');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [bulkCheckLoading, setBulkCheckLoading] = useState(false);
  const [showBulkCheckConfirm, setShowBulkCheckConfirm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchHabits = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/habits?includeArchived=true&limit=100');
      setAllHabits(res.data.habits || res.data || []);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchHabits();
    }
  }, [user, fetchHabits]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterTab, selectedCategory, sortBy]);

  const handleToggleCheckIn = async (habitId: string) => {
    const habitToUpdate = allHabits.find((h) => h.id === habitId);
    if (!habitToUpdate) return;

    const newCompletedState = !habitToUpdate.todayCompleted;

    setAllHabits((prev) =>
      prev.map((h) => {
        if (h.id === habitId) {
          const updatedStreak = newCompletedState ? h.currentStreak + 1 : Math.max(0, h.currentStreak - 1);
          return {
            ...h,
            todayCompleted: newCompletedState,
            currentStreak: updatedStreak,
            longestStreak: Math.max(h.longestStreak, updatedStreak),
          };
        }
        return h;
      })
    );

    try {
      const res = await api.post(`/habits/${habitId}/checkin`, {});
      const { isCompleted, habit: serverHabit } = res.data;

      setAllHabits((prev) => prev.map((h) => (h.id === habitId ? serverHabit : h)));

      if (isCompleted) {
        toast.success(`Check-in completed. Streak: ${serverHabit.currentStreak} days`);
      } else {
        toast.info('Check-in removed');
      }
    } catch (error: any) {
      fetchHabits();
      toast.error(error.response?.data?.message || 'Failed to update check-in');
    }
  };

  const handleCheckAllToday = async () => {
    const uncompletedActive = allHabits.filter((h) => !h.archived && !h.todayCompleted);
    if (uncompletedActive.length === 0) {
      toast.info('All habits are already completed for today');
      return;
    }

    try {
      setBulkCheckLoading(true);
      for (const habit of uncompletedActive) {
        await api.post(`/habits/${habit.id}/checkin`, {});
      }
      await fetchHabits();
      toast.success(`Marked ${uncompletedActive.length} habit(s) completed for today`);
    } catch (error) {
      toast.error('Failed to complete remaining habits');
    } finally {
      setBulkCheckLoading(false);
    }
  };

  const handleSaveHabit = async (title: string, description?: string, category?: string) => {
    try {
      if (editingHabit) {
        await api.patch(`/habits/${editingHabit.id}`, { title, description, category });
        toast.success('Habit updated successfully');
      } else {
        await api.post('/habits', { title, description, category });
        toast.success('New habit created successfully');
      }
      setIsModalOpen(false);
      setEditingHabit(null);
      fetchHabits();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save habit');
    }
  };

  const handleArchiveToggle = async (habit: Habit) => {
    try {
      await api.patch(`/habits/${habit.id}`, { archived: !habit.archived });
      toast.success(habit.archived ? 'Habit unarchived' : 'Habit archived');
      fetchHabits();
    } catch (error: any) {
      toast.error('Failed to update habit archive status');
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await api.delete(`/habits/${habitId}`);
      toast.success('Habit deleted');
      fetchHabits();
    } catch (error: any) {
      toast.error('Failed to delete habit');
    }
  };

  const categoriesList = useMemo(() => {
    const cats = new Set<string>();
    allHabits.forEach((h) => {
      if (h.category) cats.add(h.category);
    });
    return ['All', ...Array.from(cats)];
  }, [allHabits]);

  const activeHabits = useMemo(() => allHabits.filter((h) => !h.archived), [allHabits]);
  const completedTodayCount = useMemo(
    () => activeHabits.filter((h) => h.todayCompleted).length,
    [activeHabits]
  );
  const activeStreaksTotal = useMemo(
    () => activeHabits.reduce((acc, h) => acc + (h.currentStreak > 0 ? 1 : 0), 0),
    [activeHabits]
  );

  const topHabit = useMemo(() => {
    if (activeHabits.length === 0) return null;
    return [...activeHabits].sort((a, b) => b.currentStreak - a.currentStreak)[0];
  }, [activeHabits]);

  const todayPercentage = useMemo(() => {
    if (activeHabits.length === 0) return 0;
    return Math.round((completedTodayCount / activeHabits.length) * 100);
  }, [completedTodayCount, activeHabits.length]);

  const filteredAndSortedHabits = useMemo(() => {
    let result = allHabits.filter((h) => {
      if (selectedCategory !== 'All' && h.category !== selectedCategory) return false;

      if (filterTab === 'active' && h.archived) return false;
      if (filterTab === 'completed' && (h.archived || !h.todayCompleted)) return false;
      if (filterTab === 'archived' && !h.archived) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = h.title.toLowerCase().includes(query);
        const matchesDesc = h.description && h.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === 'pending') {
        if (a.todayCompleted !== b.todayCompleted) {
          return a.todayCompleted ? 1 : -1;
        }
        return b.currentStreak - a.currentStreak;
      }
      if (sortBy === 'streak') return b.currentStreak - a.currentStreak;
      if (sortBy === 'rate') return b.completionRate90Days - a.completionRate90Days;
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [allHabits, filterTab, selectedCategory, searchQuery, sortBy]);

  const totalHabitsCount = filteredAndSortedHabits.length;
  const totalPages = Math.ceil(totalHabitsCount / limit) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const paginatedHabits = useMemo(() => {
    const start = (currentPage - 1) * limit;
    return filteredAndSortedHabits.slice(start, start + limit);
  }, [filteredAndSortedHabits, currentPage, limit]);

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-900 border-t-transparent" />
          <span className="text-xs font-semibold text-slate-500">Loading HabitPulse...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      <Navbar onOpenCreateModal={() => { setEditingHabit(null); setIsModalOpen(true); }} />

      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
              Welcome back, {user?.name || user?.email?.split('@')[0]}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
              Track daily habits, measure consistency streaks, and view progress analytics.
            </p>
          </div>

          <button
            onClick={() => { setEditingHabit(null); setIsModalOpen(true); }}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Create Habit</span>
          </button>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1 sm:mb-2">
              <span className="text-[11px] sm:text-xs font-semibold">Active Habits</span>
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">{activeHabits.length}</div>
            <div className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500">Currently tracking</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1 sm:mb-2">
              <span className="text-[11px] sm:text-xs font-semibold">Done Today</span>
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">
              {completedTodayCount} <span className="text-xs font-normal text-slate-400">/ {activeHabits.length}</span>
            </div>
            <div className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500">{todayPercentage}% completed</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1 sm:mb-2">
              <span className="text-[11px] sm:text-xs font-semibold">Active Streaks</span>
              <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
            </div>
            <div className="text-lg sm:text-2xl font-black text-slate-900">{activeStreaksTotal}</div>
            <div className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500">Habits on streak</div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-500 mb-1 sm:mb-2">
              <span className="text-[11px] sm:text-xs font-semibold">Top Streak</span>
              <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">
              {topHabit ? topHabit.title : 'N/A'}
            </div>
            <div className="mt-0.5 text-[10px] sm:text-[11px] text-slate-500 truncate">
              {topHabit ? `${topHabit.currentStreak} day streak` : 'No habits yet'}
            </div>
          </div>
        </div>

        {!loading && allHabits.length > 0 && (
          <div className="mb-6">
            <CombinedHeatmap habits={allHabits} />
          </div>
        )}

        {activeHabits.length > 0 && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 sm:text-sm">
                  <CheckCheck className="h-4 w-4 text-emerald-600" />
                  <span>Today&apos;s Focus ({completedTodayCount}/{activeHabits.length} Completed)</span>
                </div>
                <div className="mt-2 h-2.5 w-full sm:w-80 overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${todayPercentage}%` }}
                  />
                </div>
              </div>

              {completedTodayCount < activeHabits.length && (
                <button
                  onClick={() => setShowBulkCheckConfirm(true)}
                  disabled={bulkCheckLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition disabled:opacity-50"
                >
                  {bulkCheckLoading ? 'Checking...' : 'Check Off Remaining Today'}
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col gap-3.5 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {(['active', 'completed', 'all', 'archived'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition capitalize whitespace-nowrap shrink-0 ${
                  filterTab === tab
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab === 'active' ? 'Active' : tab === 'completed' ? 'Completed Today' : tab === 'all' ? 'All Habits' : 'Archived'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search habits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition"
              />
            </div>

            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-1.5">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-500 text-[11px]">Sort by:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="pending">Pending First (Uncompleted Today)</option>
                <option value="streak">Highest Streak</option>
                <option value="rate">Highest 90-Day Rate</option>
                <option value="newest">Newest First</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {categoriesList.length > 1 && (
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1 shrink-0">
                <Filter className="h-3 w-3" /> Category:
              </span>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition whitespace-nowrap shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <DashboardSkeleton />
        ) : paginatedHabits.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/50 py-12 px-4 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 mb-3 border border-slate-200">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No habits found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              {searchQuery
                ? 'No habits match your search query.'
                : filterTab === 'archived'
                ? 'You have no archived habits.'
                : 'Start tracking your daily goals by creating your first habit.'}
            </p>
            {!searchQuery && filterTab !== 'archived' && (
              <button
                onClick={() => { setEditingHabit(null); setIsModalOpen(true); }}
                className="mt-5 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition shadow-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Create Habit</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggleCheckIn={handleToggleCheckIn}
                  onEdit={(h) => { setEditingHabit(h); setIsModalOpen(true); }}
                  onArchiveToggle={handleArchiveToggle}
                  onDelete={handleDeleteHabit}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-5">
                <div className="text-xs text-slate-500 text-center sm:text-left">
                  Showing <span className="font-bold text-slate-900">{(currentPage - 1) * limit + 1}</span> to{' '}
                  <span className="font-bold text-slate-900">{Math.min(currentPage * limit, totalHabitsCount)}</span> of{' '}
                  <span className="font-bold text-slate-900">{totalHabitsCount}</span> habits
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1 overflow-x-auto max-w-[180px] sm:max-w-none">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                      <button
                        key={pNum}
                        onClick={() => setPage(pNum)}
                        className={`h-8 w-8 rounded-lg text-xs font-bold transition shrink-0 ${
                          currentPage === pNum
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {pNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <HabitModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingHabit(null); }}
        onSave={handleSaveHabit}
        initialData={editingHabit}
      />

      <ConfirmModal
        isOpen={showBulkCheckConfirm}
        onClose={() => setShowBulkCheckConfirm(false)}
        onConfirm={handleCheckAllToday}
        title="Check Off Remaining Habits"
        message={`Are you sure you want to mark all ${activeHabits.length - completedTodayCount} remaining uncompleted habit(s) as completed for today?`}
        confirmText="Check Off All"
        confirmVariant="primary"
        loading={bulkCheckLoading}
      />
    </div>
  );
}
