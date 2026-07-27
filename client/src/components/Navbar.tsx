'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Activity, LogOut, Plus, User as UserIcon, Settings } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal?: () => void;
}

export function Navbar({ onOpenCreateModal }: NavbarProps) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 transition opacity-90 hover:opacity-100">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white font-bold shadow-sm">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">HabitPulse</span>
              <span className="ml-2 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                Tracker
              </span>
            </div>
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              {onOpenCreateModal && (
                <button
                  onClick={onOpenCreateModal}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 active:scale-95 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:inline">New Habit</span>
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:border-slate-300 transition focus:outline-none"
                  title="Account Options"
                >
                  <UserIcon className="h-4 w-4" />
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100 mb-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{user.name || 'User'}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      <Link
                        href="/settings"
                        onClick={() => setShowDropdown(false)}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
                      >
                        <Settings className="h-4 w-4 text-slate-500" />
                        <span>Profile & Settings</span>
                      </Link>

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          setShowLogoutConfirm(true);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="h-4 w-4 text-rose-600" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition px-3 py-1.5"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </header>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Sign Out"
        message="Are you sure you want to sign out of your HabitPulse account?"
        confirmText="Sign Out"
        confirmVariant="primary"
      />
    </>
  );
}
