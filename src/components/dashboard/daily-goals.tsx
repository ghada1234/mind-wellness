
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Droplets, Footprints, BookOpen, BrainCircuit } from 'lucide-react';
import { useWaterIntake } from '@/hooks/use-water-intake';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';


interface ActivityLog {
  id: string;
  duration: number;
  createdAt: Timestamp | Date;
}
interface JournalEntry {
    id: string;
    createdAt: Timestamp | Date;
}
interface MeditationSession {
    id: string;
    duration: number;
    createdAt: Timestamp | Date;
}


export function DailyGoals() {
    const { waterIntake } = useWaterIntake();
    const { data: activityData } = useFirestore<ActivityLog>('activityLog');
    const { data: journalData } = useFirestore<JournalEntry>('journalEntries');
    const { data: meditationData } = useFirestore<MeditationSession>('meditationSessions');

    const today = new Date().toLocaleDateString();

    const totalActivity = activityData
        .filter(entry => new Date(entry.createdAt as Date).toLocaleDateString() === today)
        .reduce((sum, entry) => sum + entry.duration, 0);

    const totalMeditation = meditationData
        .filter(entry => new Date(entry.createdAt as Date).toLocaleDateString() === today)
        .reduce((sum, entry) => sum + entry.duration, 0);
        
    const journalEntriesToday = journalData
        .filter(entry => new Date(entry.createdAt as Date).toLocaleDateString() === today)
        .length;

    const goals = [
        {
            icon: BrainCircuit,
            title: 'Meditate',
            current: totalMeditation,
            target: 10,
            unit: 'minutes',
        },
        {
            icon: Droplets,
            title: 'Drink Water',
            current: waterIntake.glasses,
            target: waterIntake.goal,
            unit: 'glasses',
        },
        {
            icon: Footprints,
            title: 'Walk',
            current: totalActivity,
            target: 30,
            unit: 'minutes',
        },
        {
            icon: BookOpen,
            title: 'Journal',
            current: journalEntriesToday,
            target: 1,
            unit: 'entry',
        },
    ];

    const calculateProgress = (current: number, target: number) => {
        if (target === 0) return 0;
        return Math.min((current / target) * 100, 100);
    };
    
    const getRemainingText = (current: number, target: number, unit: string) => {
        if (current >= target) return 'Completed';
        const remaining = target - current;
        const pluralUnit = remaining > 1 && !unit.endsWith('s') ? `${unit}s` : unit;
        return `${remaining} ${pluralUnit} more to go`;
    }

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Daily Goals</CardTitle>
        <CardDescription>
          Stay on track with your wellness targets for today.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target);
          const remainingText = getRemainingText(goal.current, goal.target, goal.unit);
          return (
            <div key={goal.title} className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <goal.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <p className="font-medium">{goal.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()}{' '}
                    {goal.unit}
                  </p>
                </div>
                <Progress value={progress} className="mt-1 h-2" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {remainingText}
                </p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
