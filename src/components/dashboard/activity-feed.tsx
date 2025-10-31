
'use client';

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { BrainCircuit, Utensils, Smile, Dumbbell, Bed, BookText, Wind } from 'lucide-react';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  text: string;
  createdAt: Timestamp | Date;
}

const iconMap: { [key: string]: React.ElementType } = {
    mood: Smile,
    meditation: BrainCircuit,
    nutrition: Utensils,
    activity: Dumbbell,
    sleep: Bed,
    journal: BookText,
    breathing: Wind,
};

const typeToCollectionMap: { [key: string]: string } = {
    mood: 'moodEntries',
    meditation: 'meditationLog',
    nutrition: 'mealEntries',
    activity: 'activityLog',
    sleep: 'sleepLog',
    journal: 'journalLog',
    breathing: 'breathingLog',
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} years ago`;

  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} months ago`;

  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;

  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;

  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;

  return `${Math.floor(seconds)} seconds ago`;
};

const transformData = (collectionName: string, data: any[]): Activity[] => {
    return data.map(item => {
        let text = '';
        switch(collectionName) {
            case 'moodEntries': text = `Logged '${item.mood}' mood`; break;
            case 'meditationLog': text = `Completed '${item.title}' meditation`; break;
            case 'mealEntries': text = `Logged ${item.type}`; break;
            case 'activityLog': text = `Logged '${item.activityName}' activity`; break;
            case 'sleepLog': text = `Logged ${item.duration}h of sleep`; break;
            case 'journalLog': text = `Wrote a journal entry`; break;
            case 'breathingLog': text = `Completed '${item.technique}' breathing`; break;
            default: text = 'Logged an activity';
        }
        // Handle both Firestore Timestamp and Date objects
        let createdAtDate: Date;
        if (item.createdAt) {
            if (item.createdAt instanceof Date) {
                createdAtDate = item.createdAt;
            } else if (typeof (item.createdAt as Timestamp)?.toDate === 'function') {
                createdAtDate = (item.createdAt as Timestamp).toDate();
            } else {
                createdAtDate = new Date();
            }
        } else {
            createdAtDate = new Date();
        }

        return {
            id: item.id,
            type: Object.keys(typeToCollectionMap).find(key => typeToCollectionMap[key] === collectionName) || 'activity',
            text,
            createdAt: createdAtDate,
        };
    });
};

export function ActivityFeed() {
  const { data: moodData, loading: moodLoading } = useFirestore('moodEntries', { limit: 5 });
  const { data: meditationData, loading: meditationLoading } = useFirestore('meditationLog', { limit: 5 });
  const { data: nutritionData, loading: nutritionLoading } = useFirestore('mealEntries', { limit: 5 });
  const { data: activityData, loading: activityLoading } = useFirestore('activityLog', { limit: 5 });
  const { data: sleepData, loading: sleepLoading } = useFirestore('sleepLog', { limit: 5 });
  const { data: journalData, loading: journalLoading } = useFirestore('journalLog', { limit: 5 });
  const { data: breathingData, loading: breathingLoading } = useFirestore('breathingLog', { limit: 5 });

  const allActivities = React.useMemo(() => {
    const combined = [
      ...transformData('moodEntries', moodData),
      ...transformData('meditationLog', meditationData),
      ...transformData('mealEntries', nutritionData),
      ...transformData('activityLog', activityData),
      ...transformData('sleepLog', sleepData),
      ...transformData('journalLog', journalData),
      ...transformData('breathingLog', breathingData),
    ];
    
    return combined
        .sort((a, b) => (b.createdAt as Date).getTime() - (a.createdAt as Date).getTime())
        .slice(0, 5); // Get the 5 most recent activities
  }, [moodData, meditationData, nutritionData, activityData, sleepData, journalData, breathingData]);

  const isLoading = moodLoading || meditationLoading || nutritionLoading || activityLoading || sleepLoading || journalLoading || breathingLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
            <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : allActivities.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
                <p>No recent activity. Log something to get started!</p>
            </div>
        ) : (
            allActivities.map((activity) => {
                const Icon = iconMap[activity.type] || Dumbbell;
                return (
                    <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                        <p className="text-sm font-medium">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">
                            {formatTimeAgo(activity.createdAt as Date)}
                        </p>
                        </div>
                    </div>
                );
            })
        )}
      </CardContent>
    </Card>
  );
}
