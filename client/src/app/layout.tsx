import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'HabitPulse - Personal Habit & Consistency Tracker',
  description: 'Track daily habits, view 90-day contribution heatmaps, and maintain consistent streaks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans selection:bg-slate-900 selection:text-white">
        <AuthProvider>
          {children}
          <Toaster theme="light" position="bottom-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
