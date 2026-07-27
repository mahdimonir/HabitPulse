# HabitPulse - Express Backend API Service

> Express (TypeScript) REST API backend service with Neon PostgreSQL & Prisma ORM for the HabitPulse Habit Tracker application.

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: Node.js (TypeScript)
- **Framework**: Express.js (Modular extensionless TypeScript architecture)
- **Database**: PostgreSQL (Neon Cloud)
- **ORM**: Prisma ORM v7 (`@prisma/adapter-pg`)
- **Documentation**: Swagger UI (`/api-docs`)
- **Validation**: Zod schema validation
- **Authentication**: JWT & bcrypt password hashing
- **Deployment**: Render / Railway compatible

---

## 📁 Environment Variables

Create `.env` in `server/`:
```env
PORT=8000
DATABASE_URL="postgresql://neondb_owner:...@ep-lingering-salad-ao045m8m-pooler.c-2.ap-southeast-1.aws.neon.tech/HabitTracker?sslmode=require"
JWT_ACCESS_SECRET="your-access-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
CLIENT_URL="http://localhost:3000"
NODE_ENV=development
```

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:push

# Seed database with demo user & 20 sample habits
npm run seed

# Start development server
npm run dev
```

Server API: `http://localhost:8000/api/v1`  
Swagger API Docs: `http://localhost:8000/api-docs`

Demo Credentials:
- **Email**: `demo@habitpulse.com`
- **Password**: `password123`

---

## 🌐 Deploying to Render

1. Create a **Web Service** on [Render](https://render.com).
2. Connect your Git repository and set the **Root Directory** to `server`.
3. Set **Build Command**: `npm run build`
4. Set **Start Command**: `npm run start`
5. Add Environment Variables (`DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`, `NODE_ENV=production`).
