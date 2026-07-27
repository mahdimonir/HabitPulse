# HabitPulse - Personal Habit & Consistency Tracker

A production-grade, full-stack habit tracker built with **Next.js (App Router)**, **Express (TypeScript)**, **Neon PostgreSQL**, and **Prisma ORM**.

---

## 🌟 Overview & Key Features

- **GitHub-Style 365-Day Combined Heatmap**: Aggregates check-in completion intensity across all active habits over 365 days on the main Overview Dashboard with automatic month alignment and mobile touch auto-scroll.
- **Interactive 365-Day Habit Calendar**: Individual habit detail pages feature a full 365-day interactive grid to record or remove historical check-ins.
- **Pending Tasks Prioritization**: Dashboard default view places uncompleted daily tasks at the top with quick check-in toggle actions.
- **Habit Categories & Search**: Filter habits by `Learning`, `Fitness`, `Health`, `Productivity`, `Mindfulness`, and `Finance`.
- **Server & In-Memory Pagination**: Responsive pagination (`page`, `limit`, `total`) and sorting (`Pending First`, `Highest Streak`, `Highest 90-Day Rate`, `Newest First`, `Title A-Z`).
- **Confirmation Modals**: Dialogs before critical actions (Bulk Check-in All, Uncheck Completed Task, Delete, Archive, Sign Out).
- **Profile & Password Management**: Manage user profile name and change passwords with Zod validation and visibility toggles.
- **Swagger OpenAPI Documentation**: Interactive API documentation at `/api-docs`.
- **100% Mobile & Touch Responsive**: Mobile-first touch container layouts.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | Next.js 16+ (App Router), TypeScript, Vanilla CSS + Tailwind CSS, Sonner Toast, Lucide Icons |
| **Backend** | Node.js, Express.js (Modular TypeScript architecture), Zod, JWT, bcrypt, Swagger UI |
| **Database & ORM** | PostgreSQL (Neon Cloud DB), Prisma ORM v7 (`@prisma/adapter-pg`) |

---

## 🚀 Local Setup Instructions

### 1. Backend Setup (`/server`)
```bash
cd server
npm install
npm run prisma:generate
npm run prisma:push
npm run seed
npm run dev
```

Server API will run at `http://localhost:8000/api/v1`.  
Interactive Swagger API docs available at `http://localhost:8000/api-docs`.

Demo Account Credentials:
- **Email**: `demo@habitpulse.com`
- **Password**: `password123`

### 2. Frontend Setup (`/client`)
```bash
cd client
npm install
npm run dev
```

Client app will run at `http://localhost:3000`.

---

## 🌐 Deployment Instructions

### Deploying Client to Vercel
1. Import your GitHub repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to `client`.
3. Framework Preset: **Next.js**.
4. Set Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://<your-render-backend-url>/api/v1`
5. Click **Deploy**.

### Deploying Server to Render
1. Create a **Web Service** on [Render](https://render.com).
2. Set **Root Directory** to `server`.
3. Set **Build Command**: `npm run build`
4. Set **Start Command**: `npm run start`
5. Set Environment Variables:
   - `DATABASE_URL`: Your Neon PostgreSQL Connection String
   - `JWT_ACCESS_SECRET`: Secret key string
   - `JWT_REFRESH_SECRET`: Secret key string
   - `CLIENT_URL`: `https://<your-vercel-frontend-url>`
   - `NODE_ENV`: `production`
