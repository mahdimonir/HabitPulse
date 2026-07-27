import { prisma } from '../src/prisma.js';
import bcrypt from 'bcrypt';

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

async function main() {
  await prisma.checkIn.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'demo@habitpulse.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  });

  const habitsData = [
    { title: 'Read 20 mins', description: 'Read non-fiction or tech books daily', category: 'Learning' },
    { title: 'Morning Workout', description: '30 mins cardio or strength training', category: 'Fitness' },
    { title: 'Drink 3L Water', description: 'Stay hydrated throughout the day', category: 'Health' },
    { title: 'Code & Build', description: 'Build side projects and solve coding challenges', category: 'Productivity' },
    { title: 'Meditation', description: '10 mins mindfulness & breathing exercises', category: 'Mindfulness' },
    { title: 'Journaling', description: 'Write daily reflections and goals', category: 'Mindfulness' },
    { title: 'Cold Shower', description: 'Take a refreshing cold shower every morning', category: 'Health' },
    { title: 'Track Expenses', description: 'Log all daily purchases in budgeting app', category: 'Finance' },
    { title: 'Stretch 15 mins', description: 'Daily full-body mobility & flexibility stretching', category: 'Fitness' },
    { title: 'No Sugar Day', description: 'Avoid added sugars and sugary drinks', category: 'Health' },
    { title: 'Learn Spanish', description: 'Practice 15 mins of Spanish on Duolingo', category: 'Learning' },
    { title: 'Walk 10,000 Steps', description: 'Hit daily step target around the neighborhood', category: 'Fitness' },
    { title: 'Plan Next Day', description: 'Set top 3 priorities before sleeping', category: 'Productivity' },
    { title: 'Deep Work Session', description: '2 hours of uninterrupted focused work', category: 'Productivity' },
    { title: 'Practice Guitar', description: '20 mins of fingerpicking practice', category: 'Learning' },
    { title: 'Eat 1 Fruit', description: 'Include fresh fruit in daily breakfast', category: 'Health' },
    { title: 'No Social Media before 10 AM', description: 'Avoid checking feeds right after waking up', category: 'Mindfulness' },
    { title: 'Review Investments', description: 'Weekly review of stocks & savings portfolio', category: 'Finance' },
    { title: '8 Hours Sleep', description: 'Go to bed by 11 PM and wake up at 7 AM', category: 'Health' },
    { title: 'Clean Desk Space', description: 'Tidy up work area at the end of the day', category: 'Productivity' },
  ];

  const habits = [];
  for (const h of habitsData) {
    const habit = await prisma.habit.create({
      data: {
        userId: user.id,
        title: h.title,
        description: h.description,
        category: h.category,
      },
    });
    habits.push(habit);
  }

  const today = new Date();

  for (let i = 0; i < habits.length; i++) {
    const habit = habits[i];
    const probability = 0.4 + (i % 5) * 0.12;

    for (let dayOffset = 0; dayOffset < 90; dayOffset++) {
      const date = subDays(today, dayOffset);
      const dateStr = formatDateKey(date);

      const isRecentDay = dayOffset < 5;
      if (isRecentDay || Math.random() < probability) {
        await prisma.checkIn.create({
          data: {
            habitId: habit.id,
            date: dateStr,
          },
        });
      }
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
