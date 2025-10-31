
'use client';

import * as React from 'react';
import { StatCard } from '@/components/dashboard/stat-card';
import { DailyGoals } from '@/components/dashboard/daily-goals';
import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { CtaCards } from '@/components/dashboard/cta-cards';
import { Bed, Apple, Dumbbell, Smile, Droplets } from 'lucide-react';
import { useFirestore } from '@/hooks/use-firestore';
import { useWaterIntake } from '@/hooks/use-water-intake';
import type { Timestamp } from 'firebase/firestore';
import { RecentLogsTable } from '@/components/dashboard/recent-logs-table';

interface SleepLog {
  id: string;
  duration: number;
  createdAt: Timestamp | Date;
}

interface MealEntry {
  id: string;
  items: { calories: number }[];
  createdAt: Timestamp | Date;
}

interface ActivityLog {
  id: string;
  duration: number;
  createdAt: Timestamp | Date;
}

interface MoodEntry {
  id: string;
  mood: string;
  createdAt: Timestamp | Date;
}

export default function Home() {
  const { data: sleepData } = useFirestore<SleepLog>('sleepLog');
  const { data: nutritionData } = useFirestore<MealEntry>('mealEntries');
  const { data: activityData } = useFirestore<ActivityLog>('activityLog');
  const { data: moodData } = useFirestore<MoodEntry>('moodEntries');
  const { waterIntake } = useWaterIntake();

  const lastSleep = sleepData.length > 0 ? `${sleepData[0].duration}h` : 'N/A';
  
  const latestNutritionEntry = nutritionData.length > 0 ? nutritionData[0] : null;
  const lastLoggedNutritionDate = latestNutritionEntry ? new Date(latestNutritionEntry.createdAt as Date).toLocaleDateString() : null;
  
  const totalCalories = nutritionData
        .filter(entry => new Date(entry.createdAt as Date).toLocaleDateString() === lastLoggedNutritionDate)
        .reduce((sum, entry) => sum + entry.items.reduce((itemSum, item) => itemSum + item.calories, 0), 0)

  const latestActivityEntry = activityData.length > 0 ? activityData[0] : null;
  const lastLoggedActivityDate = latestActivityEntry ? new Date(latestActivityEntry.createdAt as Date).toLocaleDateString() : null;

  const totalActivity = activityData
        .filter(entry => new Date(entry.createdAt as Date).toLocaleDateString() === lastLoggedActivityDate)
        .reduce((sum, entry) => sum + entry.duration, 0);

  const latestMood = moodData.length > 0 ? moodData[0].mood : 'N/A';
  const waterValue = `${waterIntake.glasses}/${waterIntake.goal}`;
  
  const today = new Date().toLocaleDateString();
  const isToday = (date: Date | Timestamp | null) => {
    if (!date) return false;
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleDateString() === today;
  }
  
  const getStatTitle = (data: {createdAt: Timestamp | Date}[], title: string) => {
    return isToday(data[0]?.createdAt) ? `Today's ${title}` : `Last ${title}`;
  }


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title={getStatTitle(sleepData, 'Sleep')}
          value={lastSleep}
          description=""
          icon={Bed}
        />
        <StatCard
          title={getStatTitle(nutritionData, 'Nutrition')}
          value={totalCalories.toFixed(0)}
          description="Calories consumed"
          icon={Apple}
        />
        <StatCard
          title={getStatTitle(activityData, 'Activity')}
          value={`${totalActivity} min`}
          description="Workout time"
          icon={Dumbbell}
        />
         <StatCard
          title={getStatTitle(moodData, 'Mood')}
          value={latestMood}
          description="How you're feeling"
          icon={Smile}
        />
         <StatCard
          title="Water Intake"
          value={waterValue}
          description="Today's Glasses"
          icon={Droplets}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <DailyGoals />
            <RecentLogsTable />
        </div>
        <ActivityFeed />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <CtaCards />
      </div>
    </div>
  );
}
