
'use client';

import { Bed, Clock, Coffee, Sparkles, Star, Tv, Utensils, Edit, Trash2, Loader2 } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';

const sleepFactors = [
  { id: 'caffeine', label: 'Caffeine Late', emoji: '☕️' },
  { id: 'screen-time', label: 'Screen Time', emoji: '📱' },
  { id: 'heavy-meal', label: 'Heavy Meal', emoji: '🍔' },
  { id: 'alcohol', label: 'Alcohol', emoji: '🍷' },
  { id: 'room-temp', label: 'Room Temp', emoji: '🌡️' },
  { id: 'noise', label: 'Noise', emoji: '🔊' },
  { id: 'comfy-bed', label: 'Comfy Bed', emoji: '🛏️' },
  { id: 'reading', label: 'Reading', emoji: '📚' },
];

const sleepQualityLevels = [
  { level: 'Excellent', emoji: '✨' },
  { level: 'Good', emoji: '😊' },
  { level: 'Fair', emoji: '🙂' },
  { level: 'Poor', emoji: '😕' },
  { level: 'Terrible', emoji: '😫' },
];

const sleepTips = [
  {
    icon: Coffee,
    title: 'Avoid Caffeine & Heavy Meals',
    description:
      'Avoid stimulants like caffeine or large meals close to bedtime.',
  },
  {
    icon: Sparkles,
    title: 'Create a Relaxing Routine',
    description: 'Wind down with a book, soft music, or a warm bath.',
  },
  {
    icon: Tv,
    title: 'Limit Screen Time',
    description: 'The blue light from screens can disrupt your sleep cycle.',
  },
  {
    icon: Utensils,
    title: 'Optimize Your Environment',
    description: 'Keep your bedroom dark, quiet, and cool.',
  },
];

const initialChartData = [
  { day: 'Mon', hours: 0 },
  { day: 'Tue', hours: 0 },
  { day: 'Wed', hours: 0 },
  { day: 'Thu', hours: 0 },
  { day: 'Fri', hours: 0 },
  { day: 'Sat', hours: 0 },
  { day: 'Sun', hours: 0 },
];

const chartConfig = {
  hours: {
    label: 'Sleep Hours',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

interface SleepLog {
  id: string;
  bedtime: string;
  wakeTime: string;
  quality: string;
  factors: string[];
  notes: string;
  date: string;
  duration: number;
  createdAt: Timestamp | Date;
}

const defaultLogState = {
    bedtime: '22:30',
    wakeTime: '06:30',
    quality: 'Good',
    factors: [],
    notes: '',
};

export default function SleepTrackerPage() {
    const { data: sleepLog, loading, addDocument, updateDocument, deleteDocument, hasMore, loadMore, loadingMore } = useFirestore<SleepLog>('sleepLog', { limit: 10 });
    const [isSaving, setIsSaving] = React.useState(false);
    const [currentLog, setCurrentLog] = React.useState<Partial<SleepLog>>(defaultLogState);
    const { toast } = useToast();

    const calculateDuration = (bedtime: string, wakeTime: string) => {
        const bed = new Date(`1970-01-01T${bedtime}:00`);
        let wake = new Date(`1970-01-01T${wakeTime}:00`);
        if (wake < bed) {
            wake.setDate(wake.getDate() + 1);
        }
        const diff = wake.getTime() - bed.getTime();
        return parseFloat((diff / (1000 * 60 * 60)).toFixed(1));
    };

    const handleSaveLog = async () => {
        const duration = calculateDuration(currentLog.bedtime!, currentLog.wakeTime!);
        setIsSaving(true);
        try {
            if (currentLog.id) {
                await updateDocument(currentLog.id, {...currentLog, duration });
                toast({ title: "Sleep log updated!" });
            } else {
                await addDocument({
                    ...currentLog,
                    date: new Date().toLocaleDateString(),
                    duration,
                } as Omit<SleepLog, 'id' | 'createdAt'>);
                toast({ title: "Sleep data saved!" });
            }
            setCurrentLog(defaultLogState);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to save log'});
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleEdit = (log: SleepLog) => {
        setCurrentLog(log);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDocument(id);
            toast({ title: "Sleep log deleted." });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to delete log'});
        }
    };
    
    const handleFactorChange = (factorId: string, checked: boolean) => {
        const currentFactors = currentLog.factors || [];
        if (checked) {
            setCurrentLog({ ...currentLog, factors: [...currentFactors, factorId] });
        } else {
            setCurrentLog({ ...currentLog, factors: currentFactors.filter(f => f !== factorId) });
        }
    };
    
    const formatDateTime = (date: Date | Timestamp) => {
        const d = date instanceof Date ? date : date.toDate();
        return d.toLocaleString();
    }
    
    const chartData = React.useMemo(() => {
        if (sleepLog.length === 0) return initialChartData;

        const sortedLog = [...sleepLog].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-7);
        
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        return sortedLog.map(log => ({
            day: days[new Date(log.date).getDay()],
            hours: log.duration,
        }));
    }, [sleepLog]);

    const noData = sleepLog.length === 0;

    const avgSleep = sleepLog.length > 0 ? (sleepLog.reduce((a, b) => a + b.duration, 0) / sleepLog.length).toFixed(1) : 'N/A';
    const avgQuality = sleepLog.length > 0 ? sleepLog[0].quality : 'N/A';

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Sleep Tracker</h1>
        <p className="text-muted-foreground">
          Monitor your sleep patterns to improve your rest and energy levels.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{currentLog.id ? 'Edit Sleep Log' : "Log Last Night's Sleep"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bedtime">Bedtime</Label>
                  <Input id="bedtime" type="time" value={currentLog.bedtime} onChange={(e) => setCurrentLog({...currentLog, bedtime: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wake-time">Wake Time</Label>
                  <Input id="wake-time" type="time" value={currentLog.wakeTime} onChange={(e) => setCurrentLog({...currentLog, wakeTime: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>How was your sleep quality?</Label>
                <RadioGroup
                  value={currentLog.quality}
                  onValueChange={(value) => setCurrentLog({...currentLog, quality: value})}
                  className="flex flex-wrap gap-4"
                >
                  {sleepQualityLevels.map((quality) => (
                    <div key={quality.level} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={quality.level}
                        id={`quality-${quality.level.toLowerCase()}`}
                      />
                      <Label htmlFor={`quality-${quality.level.toLowerCase()}`}>
                        {quality.emoji} {quality.level}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label>What factors may have affected your sleep?</Label>
                <div className="flex flex-wrap gap-4">
                  {sleepFactors.map((factor) => (
                    <div
                      key={factor.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox id={factor.id} checked={currentLog.factors?.includes(factor.id)} onCheckedChange={(checked) => handleFactorChange(factor.id, !!checked)} />
                      <Label htmlFor={factor.id} className="font-normal">
                        {factor.emoji} {factor.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any dreams, thoughts, or interruptions?"
                  value={currentLog.notes}
                  onChange={(e) => setCurrentLog({...currentLog, notes: e.target.value})}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveLog} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentLog.id ? 'Update Log' : 'Save Sleep Data'}
                </Button>
              {currentLog.id && <Button variant="ghost" className="ml-2" onClick={() => setCurrentLog(defaultLogState)}>Cancel Edit</Button>}
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sleep Log</CardTitle>
              <CardDescription>Your recent sleep logs.</CardDescription>
            </CardHeader>
            <CardContent>
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : sleepLog.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                    <Bed className="mx-auto h-12 w-12" />
                    <p className="mt-4 font-semibold">No sleep logged yet.</p>
                    <p className="text-sm">
                        Log your first night's sleep to get started!
                    </p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {sleepLog.map(log => (
                        <li key={log.id} className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <p className="font-semibold">{log.duration} hours</p>
                                <p className="text-sm text-muted-foreground">
                                    {log.quality} sleep on {formatDateTime(log.createdAt)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Bedtime: {log.bedtime} - Wake Time: {log.wakeTime}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(log)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(log.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            </CardContent>
             {hasMore && (
              <CardFooter>
                <Button onClick={loadMore} disabled={loadingMore} className="w-full">
                  {loadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Load More
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Patterns This Week</CardTitle>
              <CardDescription>
                Your sleep goal is 8 hours per night.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {noData ? (
                <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
                  <Clock className="h-12 w-12" />
                  <p className="mt-4 font-semibold">No Chart Data Yet</p>
                  <p className="text-sm">
                    Log your sleep for a few days to see your patterns.
                  </p>
                </div>
              ) : (
                <ChartContainer
                  config={chartConfig}
                  className="h-[200px] w-full"
                >
                  <RechartsBarChart accessibilityLayer data={chartData}>
                    <YAxis
                      domain={[0, 12]}
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                      hide
                    />
                     <XAxis
                      dataKey="day"
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
                  </RechartsBarChart>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sleep Insights</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{avgSleep}</p>
                <p className="text-xs text-muted-foreground">Avg. Sleep</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{avgQuality}</p>
                <p className="text-xs text-muted-foreground">Avg. Quality</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{sleepLog.length}</p>
                <p className="text-xs text-muted-foreground">Days Tracked</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sleep Improvement Tips</CardTitle>
              <CardDescription>
                Simple habits for more restful nights.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sleepTips.map((tip) => (
                <div key={tip.title} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <tip.icon className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">{tip.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {tip.description}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
