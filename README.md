# HabitPulse – Personal Habit & Consistency Tracker

A production-ready full-stack Habit Tracker built with **Next.js (App Router)**, **Express.js**, **TypeScript**, **PostgreSQL (Neon)** and **Prisma ORM**.

This project was developed as part of the **Kodevio Limited – Full Stack Developer Intern Technical Assessment**.

---

## Live Demo

**Frontend:** https://habitpulse-virid.vercel.app

**Backend API:** https://habitpulse-l9v2.onrender.com

**Swagger API Docs:** https://habitpulse-l9v2.onrender.com/api-docs

**GitHub Repository:** https://github.com/mahdimonir/HabitPulse

---

## Project Overview

HabitPulse helps users build consistent daily habits by tracking completion history, visualizing progress through GitHub-style contribution heatmaps, and calculating streak statistics.

The application follows a modern full-stack architecture with secure authentication, REST APIs, PostgreSQL, Prisma ORM, and responsive UI.

---

# Features

## Authentication

- User Registration
- User Login
- JWT Authentication
- Access Token & Refresh Token implementation
- Protected Routes
- Password Hashing using bcrypt

---

## Habit Management

- Create Habit
- Update Habit
- Archive Habit
- Delete Habit
- Categorize Habits
- Search & Filtering
- Pagination
- Sorting

---

## Daily Check-ins

- Mark today's habit as completed
- Undo today's completion
- Historical check-ins
- Interactive calendar

---

## Streak Analytics

For every habit:

- Current Streak
- Longest Streak
- Total Check-ins
- 90-Day Completion Rate

---

## Heatmaps

### Dashboard

- Combined GitHub-style contribution heatmap
- Aggregates activity across all habits

### Habit Details

- Interactive GitHub-style contribution heatmap
- Supports historical check-ins

> **Note:** The assignment required approximately **3 months** of visualization. This implementation extends the calendar to **365 days**, fully covering the original requirement while providing a richer yearly overview.

---

## Dashboard

- Today's pending habits
- Quick check-in
- Overall statistics
- Active streak summary
- Top streak
- Activity overview

---

## User Settings

- Update profile
- Change password

---

## API Documentation

Interactive Swagger documentation available at

https://habitpulse-l9v2.onrender.com/api-docs

---

# Technology Stack

## Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Zod
- Axios
- Sonner
- Lucide React

## Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Neon)
- JWT Authentication
- bcrypt
- Swagger
- Zod

## Database

- PostgreSQL
- Prisma ORM

---

# Project Structure

```
HabitPulse
│
├── client
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── context
│   │   ├── lib
│   │   └── types
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json
│
└── server
    ├── src
    │   ├── config
    │   ├── errors
    │   ├── middleware
    │   ├── modules
    │   │   ├── auth
    │   │   ├── checkins
    │   │   └── habits
    │   ├── routes
    │   └── utils
    │
    ├── prisma
    │   ├── schema.prisma
    │   └── seed.ts
    ├── package.json
    ├── render.yaml
    └── tsconfig.json
```

---

# Local Setup

## Clone Repository

```bash
git clone https://github.com/mahdimonir/HabitPulse.git

cd HabitPulse
```

---

## Backend

```bash
cd server

npm install

cp .env.example .env
```

Configure

```
DATABASE_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
CLIENT_URL=
```

Generate Prisma Client

```bash
npm run prisma:generate
```

Push Database

```bash
npm run prisma:push
```

Seed Database

```bash
npm run seed
```

Run Server

```bash
npm run dev
```

Server:

```
http://localhost:8000
```

Swagger

```
http://localhost:8000/api-docs
```

---

## Frontend

```bash
cd client

npm install

cp .env.example .env.local
```

Configure

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Run

```bash
npm run dev
```

Client

```
http://localhost:3000
```

---

# Demo Account

Email

```
demo@habitpulse.com
```

Password

```
password123
```

---

# Technical Decisions

### Express Modular Architecture

Separated into feature modules, services, middleware, validation, and utilities for maintainability and scalability.

### Prisma ORM

Selected for type safety, migrations, and excellent TypeScript integration.

### JWT Authentication

Implemented Access Token and Refresh Token authentication to support secure sessions.

### 365-Day Heatmap

Although the assignment requested approximately three months of history, the implementation extends this to a full 365-day GitHub-style contribution calendar while still satisfying the original requirement.

### Optimistic Updates

Check-ins update immediately in the UI while synchronizing with the backend for a smoother user experience.

---

# Assumptions

- One user owns many habits.
- A habit can have at most one check-in per day.
- Archived habits remain in history but are hidden from active tracking.
- Streak calculations are based solely on recorded check-ins.

---

# Future Improvements

- Push Notifications
- Email Reminders
- Habit Scheduling (Weekdays, Custom Frequency)
- Social Sharing
- Friend Leaderboards
- Monthly Reports
- Offline Support (PWA)
- Unit & Integration Tests
- Docker Deployment
- CI/CD Pipeline

---

# Time Spent

Approximately **2 days**, including planning, backend development, frontend implementation, deployment, testing, and documentation.
