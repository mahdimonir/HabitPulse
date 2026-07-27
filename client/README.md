# HabitPulse - Next.js Frontend Client

> Modern, high-performance habit tracker web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, **Lucide Icons**, and **Sonner Toasts**.

---

## 🌟 Key Features

- **GitHub-Style 365-Day Contribution Graph**: 52-week activity contribution grid with month headers aligned over week columns and automatic touch scroll to the current month on mobile devices.
- **Pending Tasks First**: Dashboard prioritizes habits that are pending check-in today at the top of the list.
- **0ms Optimistic UI Updates**: Check-in status updates immediately with zero latency before background API synchronization.
- **Interactive Habit Heatmap**: Individual habit detail pages (`/habits/[id]`) allow users to record or remove historical check-ins directly on the heatmap grid.
- **Quick Demo Fill Button**: Login page includes a one-click button to populate sample credentials (`demo@habitpulse.com` / `password123`) for testing.
- **Automatic JWT Token Refresh**: Axios interceptor handles `401 Unauthorized` responses by automatically requesting a new access token via `/auth/refresh` without disrupting the user.
- **Confirmation Modals**: Dialog prompts before critical actions (Bulk Check Off All Today, Uncheck Completed Habit, Archive, Delete, Sign Out).
- **Profile & Password Management**: Manage user full name and security password with Zod backend validation and eye visibility toggles.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Vanilla CSS Design System
- **State & Auth**: Custom React `AuthContext` + Axios HTTP Interceptor
- **Icons**: Lucide React
- **Notifications**: Sonner Toast

---

## 📁 Environment Variables

Create `.env.local` inside `client/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev
```

App will run at `http://localhost:3000`.

---

## 🌐 Deploying to Vercel

1. Import repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Framework Preset: **Next.js**.
4. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://<your-render-backend-url>/api/v1`
5. Click **Deploy**.
