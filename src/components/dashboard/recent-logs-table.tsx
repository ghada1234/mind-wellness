
'use client';

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface Activity {
  id: string;
  type: string;
  text: string;
  createdAt: Timestamp | Date;
}

const typeToCollectionMap: { [key: string]: string } = {
  Mood: 'moodEntries',
  Meditation: 'meditationLog',
  Nutrition: 'mealEntries',
  Activity: 'activityLog',
  Sleep: 'sleepLog',
  Journal: 'journalLog',
  Breathing: 'breathingLog',
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const transformData = (collectionName: string, data: any[]): Activity[] => {
    return data.map(item => {
        let text = '';
        const type = Object.keys(typeToCollectionMap).find(key => typeToCollectionMap[key] === collectionName) || 'Unknown';
        switch(collectionName) {
            case 'moodEntries': text = `${item.mood} mood, ${item.energy} energy`; break;
            case 'meditationLog': text = `${item.title} (${item.duration} min)`; break;
            case 'mealEntries': text = `${item.type} - ${item.items.length} item(s)`; break;
            case 'activityLog': text = `${item.activityName} (${item.duration} min)`; break;
            case 'sleepLog': text = `${item.duration} hours, ${item.quality} quality`; break;
            case 'journalLog': text = `Entry with ${item.content.split(' ').length} words`; break;
            case 'breathingLog': text = `${item.technique} (${item.duration} min)`; break;
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
            type: type,
            text,
            createdAt: createdAtDate,
        };
    });
};

export function RecentLogsTable() {
  const { data: moodData, loading: moodLoading } = useFirestore('moodEntries', { limit: 10 });
  const { data: meditationData, loading: meditationLoading } = useFirestore('meditationLog', { limit: 10 });
  const { data: nutritionData, loading: nutritionLoading } = useFirestore('mealEntries', { limit: 10 });
  const { data: activityData, loading: activityLoading } = useFirestore('activityLog', { limit: 10 });
  const { data: sleepData, loading: sleepLoading } = useFirestore('sleepLog', { limit: 10 });
  const { data: journalData, loading: journalLoading } = useFirestore('journalLog', { limit: 10 });
  const { data: breathingData, loading: breathingLoading } = useFirestore('breathingLog', { limit: 10 });

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
        .slice(0, 10);
  }, [moodData, meditationData, nutritionData, activityData, sleepData, journalData, breathingData]);

  const isLoading = moodLoading || meditationLoading || nutritionLoading || activityLoading || sleepLoading || journalLoading || breathingLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Logs</CardTitle>
        <CardDescription>
          A summary of your most recent wellness entries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : allActivities.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <p>No data logged yet. Start by tracking an activity!</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allActivities.map((activity) => (
                <TableRow key={`${activity.type}-${activity.id}`}>
                  <TableCell className="font-medium">{activity.type}</TableCell>
                  <TableCell>{activity.text}</TableCell>
                  <TableCell className="text-right">
                    {formatTime(activity.createdAt as Date)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
