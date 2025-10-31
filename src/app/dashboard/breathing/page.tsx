
'use client';

import { Wind, Box, Waves, Timer, PlusCircle, History, Edit, Trash2, Loader2 } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';

const breathingExercises = [
  {
    title: '4-7-8 Technique',
    icon: Wind,
    description: 'A powerful breathwork pattern to promote calm and relaxation.',
    benefits: ['Reduces anxiety', 'Improves sleep', 'Calms nervous system'],
  },
  {
    title: 'Box Breathing',
    icon: Box,
    description:
      'A simple technique to focus the mind and regulate the autonomic nervous system.',
    benefits: ['Increases focus', 'Reduces stress', 'Improves concentration'],
  },
  {
    title: 'Deep Breathing',
    icon: Waves,
    description:
      'A foundational practice to increase oxygen flow and reduce tension.',
    benefits: ['Relaxes muscles', 'Lowers blood pressure', 'Improves mood'],
  },
];

interface SessionLog {
  id: string;
  technique: string;
  duration: number;
  date: string;
  createdAt: Timestamp | Date;
}

export default function BreathingPage() {
  const { data: sessionLog, loading, addDocument, updateDocument, deleteDocument, hasMore, loadMore, loadingMore } = useFirestore<SessionLog>('breathingLog', { limit: 10 });
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentSession, setCurrentSession] = React.useState<Partial<SessionLog>>({
    technique: '4-7-8 Technique',
    duration: 5,
  });
  const { toast } = useToast();

  const [timer, setTimer] = React.useState(300); // 5 minutes in seconds
  const [isActive, setIsActive] = React.useState(false);
  const countRef = React.useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setIsActive(true);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer - 1);
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
    setTimer(300);
  };
  
  React.useEffect(() => {
    if (timer <= 0) {
      pauseTimer();
    }
  }, [timer]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const formatDateTime = (date: Date | Timestamp) => {
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleString();
  }

  const handleLogSession = async () => {
    if (!currentSession.technique || !currentSession.duration) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please select a technique and enter a duration.',
      });
      return;
    }
    
    setIsSaving(true);
    try {
        if (currentSession.id) {
            await updateDocument(currentSession.id, {
                technique: currentSession.technique,
                duration: currentSession.duration,
            });
            toast({ title: "Session updated!" });
        } else {
            await addDocument({
                technique: currentSession.technique,
                duration: currentSession.duration,
                date: new Date().toLocaleDateString(),
            });
            toast({ title: "Breathing session logged!" });
        }
        setCurrentSession({ technique: '4-7-8 Technique', duration: 5 });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to save',
            description: 'Could not save the session. Please try again.',
        });
    } finally {
        setIsSaving(false);
    }
  };

  const handleEdit = (log: SessionLog) => {
    setCurrentSession(log);
  };
  
  const handleDelete = async (id: string) => {
    try {
        await deleteDocument(id);
        toast({ title: "Session deleted." });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to delete',
            description: 'Could not delete the session. Please try again.',
        });
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Breathing Exercises
        </h1>
        <p className="text-muted-foreground">
          Center yourself with guided breathing techniques.
        </p>
      </div>

      <Tabs defaultValue="exercises">
        <TabsList>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
          <TabsTrigger value="timer">
            <Timer className="mr-2 h-4 w-4" />
            Timer
          </TabsTrigger>
          <TabsTrigger value="log">
            <PlusCircle className="mr-2 h-4 w-4" />
            Log Session
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="mr-2 h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>
        <TabsContent value="exercises" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {breathingExercises.map((exercise) => (
              <Card key={exercise.title} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <exercise.icon className="h-6 w-6 text-primary" />
                    {exercise.title}
                  </CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <h4 className="font-semibold">Benefits:</h4>
                  <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
                    {exercise.benefits.map((benefit) => (
                      <li key={benefit}>{benefit}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Try This Exercise</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
         <TabsContent value="timer" className="mt-6">
           <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>Breathing Timer</CardTitle>
              <CardDescription>
                Set a custom timer for your own breathing practice.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6 py-12">
               <div className="text-center">
                <p className="text-6xl font-bold tabular-nums">{formatTime(timer)}</p>
                <p className="text-muted-foreground">5 minutes</p>
              </div>
              <div className="flex w-full gap-4">
                <Button className="flex-1" size="lg" onClick={isActive ? pauseTimer : startTimer} disabled={timer <= 0}>
                  {isActive ? 'Pause' : 'Start'}
                </Button>
                <Button className="flex-1" size="lg" variant="outline" onClick={resetTimer}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="log" className="mt-6">
             <Card className="mx-auto max-w-md">
                <CardHeader>
                    <CardTitle>Log Breathing Session</CardTitle>
                    <CardDescription>
                       Manually add a breathing session you did without the timer.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="space-y-2">
                      <Label htmlFor="technique">Technique</Label>
                      <Select
                        value={currentSession.technique}
                        onValueChange={(value) => setCurrentSession({ ...currentSession, technique: value })}
                      >
                        <SelectTrigger id="technique">
                          <SelectValue placeholder="Select a technique" />
                        </SelectTrigger>
                        <SelectContent>
                          {breathingExercises.map(exercise => (
                            <SelectItem key={exercise.title} value={exercise.title}>{exercise.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                   </div>
                   <div className="space-y-2">
                      <Label htmlFor="duration">Session Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="e.g. 5"
                        value={currentSession.duration || ''}
                        onChange={(e) => setCurrentSession({ ...currentSession, duration: Number(e.target.value) })}
                      />
                   </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleLogSession} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {currentSession.id ? 'Save Changes' : 'Log Session'}
                    </Button>
                    {currentSession.id && <Button variant="ghost" className="ml-2" onClick={() => setCurrentSession({ technique: '4-7-8 Technique', duration: 5 })}>Cancel</Button>}
                </CardFooter>
             </Card>
        </TabsContent>
        <TabsContent value="history" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Breathing History</CardTitle>
                </CardHeader>
                <CardContent>
                     {loading ? (
                         <div className="flex justify-center items-center h-40">
                             <Loader2 className="h-8 w-8 animate-spin" />
                         </div>
                     ) : sessionLog.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                            <History className="mx-auto h-12 w-12" />
                            <p className="mt-4 font-semibold">No Sessions Logged Yet</p>
                            <p className="text-sm">
                                Complete an exercise to see your history.
                            </p>
                        </div>
                     ) : (
                       <ul className="space-y-4">
                        {sessionLog.map((log) => (
                            <li key={log.id} className="flex items-center justify-between rounded-lg border p-4">
                            <div>
                                <p className="font-semibold">{log.technique}</p>
                                <p className="text-sm text-muted-foreground">{log.duration} minutes &bull; {formatDateTime(log.createdAt)}</p>
                            </div>
                             <div className='flex gap-2'>
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
      </Tabs>
    </div>
  );
}
