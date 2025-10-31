
'use client';

import {
  Activity,
  Calendar,
  Clock,
  PlusCircle,
  BookOpen,
  History,
  Timer,
  Book,
  Plus,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
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
import { StatCard } from '@/components/dashboard/stat-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
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
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';


const meditationSessions = [
  {
    title: 'Mindful Breathing',
    instructor: 'Sarah Wilson',
    level: 'Beginner',
    duration: '5 min',
    durationMinutes: 5,
    description:
      'A simple, powerful practice to anchor you in the present moment.',
    benefits: ['Stress Relief', 'Better Focus', 'Emotional Balance'],
    image: 'https://picsum.photos/400/250',
    imageHint: 'calm breathing',
  },
  {
    title: 'Body Scan for Deep Relaxation',
    instructor: 'Michael Chen',
    level: 'Intermediate',
    duration: '15 min',
    durationMinutes: 15,
    description: 'Release tension and cultivate awareness throughout your body.',
    benefits: ['Deep Relaxation', 'Better Sleep', 'Pain Relief'],
    image: 'https://picsum.photos/400/250',
    imageHint: 'serene body',
  },
  {
    title: 'Loving-Kindness Meditation',
    instructor: 'Emma Rodriguez',
    level: 'Beginner',
    duration: '10 min',
    durationMinutes: 10,
    description:
      'Cultivate feelings of warmth, kindness, and compassion for yourself and others.',
    benefits: ['Self-Compassion', 'Positive Emotions', 'Connection'],
    image: 'https://picsum.photos/400/250',
    imageHint: 'compassion kindness',
  },
  {
    title: 'Meditation for Anxiety',
    instructor: 'Dr. James Park',
    level: 'Advanced',
    duration: '12 min',
    durationMinutes: 12,
    description:
      'A guided session to help you manage and reduce anxious thoughts.',
    benefits: ['Anxiety Reduction', 'Calm Mind', 'Groundedness'],
    image: 'https://picsum.photos/400/250',
    imageHint: 'anxiety relief',
  },
];

interface SessionLog {
  id: string;
  title: string;
  duration: number;
  date: string;
  createdAt: Timestamp | Date;
}

export default function MeditationPage() {
  const { data: sessionLog, loading, addDocument, updateDocument, deleteDocument, hasMore, loadMore, loadingMore } = useFirestore<SessionLog>('meditationLog', { limit: 10 });
  const [isLogDialogOpen, setIsLogDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [currentSession, setCurrentSession] = React.useState<Partial<SessionLog>>({ duration: 10 });
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('guided');

  const [timer, setTimer] = React.useState(600); // 10 minutes
  const [timerDuration, setTimerDuration] = React.useState(600);
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
    setTimer(timerDuration);
  };

  React.useEffect(() => {
    if (timer <= 0) {
      pauseTimer();
      setTimer(0);
      toast({
        title: "Session Complete!",
        description: "Great job on completing your meditation session.",
      });
    }
  }, [timer, toast]);

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
    if (!currentSession.title || !currentSession.duration) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all the fields to log your session.',
      });
      return;
    }
    
    setIsSaving(true);
    try {
        if (currentSession.id) {
            await updateDocument(currentSession.id, {
                title: currentSession.title,
                duration: currentSession.duration,
            });
            toast({ title: "Session updated!" });
        } else {
            await addDocument({
                title: currentSession.title,
                duration: currentSession.duration,
                date: new Date().toLocaleDateString(),
            });
            toast({ title: "Session logged!" });
        }
        setCurrentSession({ duration: 10 });
        setIsLogDialogOpen(false);
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to save',
            description: 'Could not save session. Please try again.',
        });
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleEdit = (log: SessionLog) => {
      setCurrentSession(log);
      setIsLogDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
      try {
        await deleteDocument(id);
        toast({ title: "Session deleted." });
      } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to delete',
            description: 'Could not delete session. Please try again.',
        });
      }
  };
  
  const totalMinutes = sessionLog.reduce((sum, session) => sum + session.duration, 0);

  const handleStartMeditation = (durationMinutes: number) => {
    const durationSeconds = durationMinutes * 60;
    setTimerDuration(durationSeconds);
    setTimer(durationSeconds);
    setActiveTab('timer');
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Meditation Library
        </h1>
        <p className="text-muted-foreground">
          Find a session to calm your mind and find your focus.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Sessions This Week"
          value={sessionLog.length.toString()}
          description=""
          icon={Calendar}
        />
        <StatCard
          title="Total Time"
          value={`${totalMinutes} min`}
          description=""
          icon={Clock}
        />
        <StatCard
          title="Longest Streak"
          value="0 Days"
          description=""
          icon={Activity}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="guided">
              <BookOpen className="mr-2 h-4 w-4" />
              Guided Meditations
            </TabsTrigger>
            <TabsTrigger value="timer">
              <Timer className="mr-2 h-4 w-4" />
              Meditation Timer
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
        </div>
        <TabsContent value="guided" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {meditationSessions.map((session) => (
              <Card key={session.title} className="flex flex-col">
                <CardHeader>
                  <div className="relative mb-4 h-40 w-full">
                    <Image
                      src={session.image}
                      alt={session.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                      data-ai-hint={session.imageHint}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle>{session.title}</CardTitle>
                    <Badge variant="outline">{session.level}</Badge>
                  </div>
                  <CardDescription>{session.duration}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    With {session.instructor}
                  </p>
                  <p className="mt-2 text-sm">{session.description}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold">Benefits:</h4>
                    <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                      {session.benefits.map((benefit) => (
                        <li key={benefit}>{benefit}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleStartMeditation(session.durationMinutes)}>Start Meditation</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="timer" className="mt-6">
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <CardTitle>Unguided Meditation</CardTitle>
              <CardDescription>
                Set your own time for silent meditation.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-6 py-12">
              <div className="text-center">
                <p className="text-6xl font-bold tabular-nums">{formatTime(timer)}</p>
                <p className="text-muted-foreground">{Math.floor(timerDuration / 60)} minutes</p>
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
        <TabsContent value="log">
          <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{currentSession.id ? 'Edit' : 'Log a'} Session</DialogTitle>
                <DialogDescription>
                  Manually log your meditation session here.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="session-title">Session Title</Label>
                  <Input
                    id="session-title"
                    placeholder="e.g., Morning Mindful Breathing"
                    value={currentSession.title || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={currentSession.duration || ''}
                    onChange={(e) => setCurrentSession({ ...currentSession, duration: Number(e.target.value) })}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={() => setCurrentSession({ duration: 10 })}>Cancel</Button>
                </DialogClose>
                <Button onClick={handleLogSession} disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Plus className="mr-2" /> {currentSession.id ? 'Save Changes' : 'Log Session'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <CardDescription>
                A log of your most recent meditation practices.
              </CardDescription>
            </CardHeader>
            <CardContent>
            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : sessionLog.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                <Book className="mx-auto h-12 w-12" />
                <p className="mt-4 font-semibold">No Sessions Yet</p>
                <p className="text-sm">
                    Complete a session to see it logged here.
                </p>
                </div>
            ) : (
                <ul className="space-y-4">
                {sessionLog.map((log) => (
                    <li key={log.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                        <p className="font-semibold">{log.title}</p>
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
