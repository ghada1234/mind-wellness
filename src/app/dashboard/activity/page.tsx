
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Flame,
  Dumbbell,
  Flower,
  PlusCircle,
  History,
  Timer,
  LineChart,
  BarChart,
  Zap,
  Trash2,
  Edit,
  Loader2,
} from 'lucide-react';
import * as React from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';

const workouts = [
  {
    title: 'Quick HIIT',
    duration: '15 min',
    icon: Flame,
    exercises: ['Jumping Jacks', 'Push Ups', 'Squats', 'Burpees'],
  },
  {
    title: 'Upper Body Strength',
    duration: '45 min',
    icon: Dumbbell,
    exercises: ['Push Ups', 'Pull Ups', 'Dumbbell Press', 'Tricep Dips'],
  },
  {
    title: 'Morning Yoga',
    duration: '30 min',
    icon: Flower,
    exercises: ['Sun Salutation', 'Warrior Poses', 'Tree Pose', 'Savasana'],
  },
];

interface ActivityLog {
  id: string;
  activityName: string;
  duration: number;
  calories: number;
  date: string;
  createdAt: Timestamp | Date;
}

export default function ActivityTrackerPage() {
  const { data: activityLog, loading, addDocument, updateDocument, deleteDocument, hasMore, loadMore, loadingMore } = useFirestore<ActivityLog>('activityLog', { limit: 10 });
  const [timer, setTimer] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const countRef = React.useRef<NodeJS.Timeout | null>(null);

  const [isLogDialogOpen, setIsLogDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentActivity, setCurrentActivity] = React.useState<Partial<ActivityLog>>({});
  const { toast } = useToast();
  
  const handleSaveActivity = async () => {
    if (!currentActivity.activityName || !currentActivity.duration || !currentActivity.calories) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all the fields to log your activity.',
      });
      return;
    }
    
    setIsSaving(true);
    try {
        if (currentActivity.id) {
          await updateDocument(currentActivity.id, {
            activityName: currentActivity.activityName,
            duration: currentActivity.duration,
            calories: currentActivity.calories,
            date: currentActivity.date,
          });
          toast({ title: 'Activity Updated!' });
        } else {
          await addDocument({
            activityName: currentActivity.activityName,
            duration: currentActivity.duration,
            calories: currentActivity.calories,
            date: new Date().toLocaleDateString(),
          });
          toast({ title: 'Activity Logged!' });
        }
        setCurrentActivity({});
        setIsLogDialogOpen(false);
    } catch (error) {
         toast({
            variant: 'destructive',
            title: 'Failed to save',
            description: 'Could not save the activity. Please try again.',
        });
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleEdit = (log: ActivityLog) => {
    setCurrentActivity(log);
    setIsLogDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
        await deleteDocument(id);
        toast({ title: 'Activity Deleted' });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to delete',
            description: 'Could not delete the activity. Please try again.',
        });
    }
  };


  const startTimer = () => {
    setIsActive(true);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  };

  const pauseTimer = () => {
    setIsActive(false);
    if (countRef.current) {
      clearInterval(countRef.current);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    if (countRef.current) {
      clearInterval(countRef.current);
    }
    setTimer(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date: Date | Timestamp) => {
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleString();
  }
  
  const totalMinutes = activityLog.reduce((acc, log) => acc + log.duration, 0);
  const totalCalories = activityLog.reduce((acc, log) => acc + log.calories, 0);


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Activity Tracker</h1>
        <p className="text-muted-foreground">
          Log your workouts, track your progress, and stay motivated.
        </p>
      </div>

       <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:bg-muted">
            <CardHeader>
              <CardTitle>Log Your Activity</CardTitle>
              <CardDescription>
                Quickly add a new workout or activity to your daily log.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => setCurrentActivity({})}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Log New Activity
              </Button>
            </CardFooter>
          </Card>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentActivity.id ? 'Edit' : 'Log New'} Activity</DialogTitle>
            <DialogDescription>
              Enter the details of your workout or physical activity.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="activityName">Activity Name</Label>
              <Input id="activityName" placeholder="e.g. Running" value={currentActivity.activityName || ''} onChange={(e) => setCurrentActivity({ ...currentActivity, activityName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input id="duration" type="number" placeholder="30" value={currentActivity.duration || ''} onChange={(e) => setCurrentActivity({ ...currentActivity, duration: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calories">Calories Burned (Est.)</Label>
              <Input id="calories" type="number" placeholder="300" value={currentActivity.calories || ''} onChange={(e) => setCurrentActivity({ ...currentActivity, calories: Number(e.target.value) })}/>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setCurrentActivity({})}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveActivity} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Activity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Tabs defaultValue="workouts">
        <TabsList>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="log">
            <History className="mr-2 h-4 w-4" />
            Activity Log
          </TabsTrigger>
          <TabsTrigger value="timer">
            <Timer className="mr-2 h-4 w-4" />
            Workout Timer
          </TabsTrigger>
          <TabsTrigger value="progress">
            <LineChart className="mr-2 h-4 w-4" />
            Progress & Insights
          </TabsTrigger>
        </TabsList>
        <TabsContent value="workouts" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workouts.map((workout) => (
              <Card key={workout.title} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <workout.icon className="h-6 w-6 text-primary" />
                      {workout.title}
                    </CardTitle>
                    <CardDescription>{workout.duration}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <h4 className="font-semibold">Exercises:</h4>
                  <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                    {workout.exercises.map((exercise) => (
                      <li key={exercise}>{exercise}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Start Workout</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="log">
          <Card>
            <CardHeader>
                <CardTitle>Your Activity History</CardTitle>
            </CardHeader>
            <CardContent>
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : activityLog.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                <History className="mx-auto h-12 w-12" />
                <p className="mt-4 font-semibold">No activities logged yet.</p>
                <p className="text-sm">
                    Log an activity or complete a workout to see your history.
                </p>
                </div>
            ) : (
                <ul className="space-y-4">
                {activityLog.map((log) => (
                    <li key={log.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <p className="font-semibold">{log.activityName}</p>
                        <p className="text-sm text-muted-foreground">
                        {log.duration} min &bull; {log.calories} kcal &bull; {formatDateTime(log.createdAt)}
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
        </TabsContent>
        <TabsContent value="timer" className="mt-6">
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>Workout Timer</CardTitle>
              <CardDescription>
                Use this simple timer for your sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6 py-12">
              <div className="text-6xl font-bold tabular-nums">
                {formatTime(timer)}
              </div>
              <div className="flex w-full gap-4">
                <Button
                  className="flex-1"
                  size="lg"
                  onClick={isActive ? pauseTimer : startTimer}
                >
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button
                  className="flex-1"
                  size="lg"
                  variant="outline"
                  onClick={resetTimer}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="progress" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>
                Your total activity minutes for the last 7 days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-[200px] flex-col items-center justify-center rounded-lg bg-muted text-center text-muted-foreground">
                <BarChart className="h-12 w-12" />
                <p className="mt-4 font-semibold">No Data Yet</p>
                <p className="text-sm">
                  Log your first activity to see your weekly chart.
                </p>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>
                  Your key stats for the past week.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer className="h-5 w-5" />
                    <span className="font-semibold">Total Minutes</span>
                  </div>
                  <span className="text-2xl font-bold">{totalMinutes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5" />
                    <span className="font-semibold">Calories Burned (Est.)</span>
                  </div>
                  <span className="text-2xl font-bold">{totalCalories}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Activity Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Consistency is Improving!</h4>
                    <p className="text-sm text-muted-foreground">
                      You've been active on {new Set(activityLog.map(log => new Date(log.createdAt as Date).toLocaleDateString())).size} of the last 7 days. Keep it up!
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Dumbbell className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">Strong Cardio Focus</h4>
                    <p className="text-sm text-muted-foreground">
                      A majority of your recent workouts have been cardio-based.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
