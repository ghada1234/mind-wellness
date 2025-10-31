'use client';

import * as React from 'react';
import {
  Activity,
  Calendar,
  Clock,
  PlusCircle,
  BookOpen,
  History,
  Timer,
  Edit,
  Trash2,
  Loader2,
  Wind,
  Box,
  Waves,
  Search,
  Video,
  BookHeart,
  Sparkles,
  BrainCircuit,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';

// Breathing Exercises
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
    description: 'A simple technique to focus the mind and regulate the autonomic nervous system.',
    benefits: ['Increases focus', 'Reduces stress', 'Improves concentration'],
  },
  {
    title: 'Deep Breathing',
    icon: Waves,
    description: 'A foundational practice to increase oxygen flow and reduce tension.',
    benefits: ['Relaxes muscles', 'Lowers blood pressure', 'Improves mood'],
  },
];

// Meditation Sessions
const meditationSessions = [
  {
    title: 'Mindful Breathing',
    instructor: 'Sarah Wilson',
    level: 'Beginner',
    duration: '5 min',
    durationMinutes: 5,
    description: 'A simple, powerful practice to anchor you in the present moment.',
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
    description: 'Cultivate feelings of warmth, kindness, and compassion for yourself and others.',
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
    description: 'A guided session to help you manage and reduce anxious thoughts.',
    benefits: ['Anxiety Reduction', 'Calm Mind', 'Groundedness'],
    image: 'https://picsum.photos/400/250',
    imageHint: 'anxiety relief',
  },
];

// Mindfulness Resources
const resources = [
  {
    type: 'Article',
    icon: BookOpen,
    title: 'Getting Started with Mindfulness',
    description: 'A beginner\'s guide to the core principles of mindfulness and how to start your practice.',
    action: 'Read More',
    href: '#',
    image: 'https://picsum.photos/400/250',
    imageHint: 'mindfulness guide',
  },
  {
    type: 'Video',
    icon: Video,
    title: '10-Minute Guided Body Scan',
    description: 'A short video to guide you through a relaxing body scan meditation.',
    action: 'Watch Now',
    href: '#',
    image: 'https://picsum.photos/400/250',
    imageHint: 'body scan',
  },
  {
    type: 'Article',
    icon: BookOpen,
    title: 'The Art of Mindful Communication',
    description: 'Learn how to listen and speak with more presence and compassion.',
    action: 'Read More',
    href: '#',
    image: 'https://picsum.photos/400/250',
    imageHint: 'communication mindful',
  },
  {
    type: 'Article',
    icon: BookOpen,
    title: 'Mindful Eating for a Healthier Life',
    description: 'Discover how to bring awareness to your meals and improve your relationship with food.',
    action: 'Read More',
    href: '/dashboard/nutrition',
    image: 'https://picsum.photos/400/250',
    imageHint: 'mindful eating',
  },
  {
    type: 'Video',
    icon: Video,
    title: 'Guided Morning Meditation',
    description: 'Start your day with intention and clarity with this gentle guided session.',
    action: 'Watch Now',
    href: '#',
    image: 'https://picsum.photos/400/250',
    imageHint: 'morning meditation',
  },
  {
    type: 'Article',
    icon: BookOpen,
    title: 'The Power of Gratitude',
    description: 'An article exploring the science-backed benefits of a regular gratitude practice.',
    action: 'Read More',
    href: '/dashboard/self-love',
    image: 'https://picsum.photos/400/250',
    imageHint: 'gratitude power',
  },
];

interface BreathingLog {
  id: string;
  technique: string;
  duration: number;
  date: string;
  createdAt: Timestamp | Date;
}

interface MeditationLog {
  id: string;
  title: string;
  duration: number;
  date: string;
  createdAt: Timestamp | Date;
}

export default function PracticePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('breathing');

  // Breathing state
  const { data: breathingLog, loading: breathingLoading, addDocument: addBreathing, updateDocument: updateBreathing, deleteDocument: deleteBreathing, hasMore: breathingHasMore, loadMore: breathingLoadMore, loadingMore: breathingLoadingMore } = useFirestore<BreathingLog>('breathingLog', { limit: 10 });
  const [breathingSession, setBreathingSession] = React.useState<Partial<BreathingLog>>({
    technique: '4-7-8 Technique',
    duration: 5,
  });
  const [breathingTimer, setBreathingTimer] = React.useState(300);
  const [breathingIsActive, setBreathingIsActive] = React.useState(false);
  const breathingCountRef = React.useRef<NodeJS.Timeout | null>(null);
  const [breathingSaving, setBreathingSaving] = React.useState(false);

  // Meditation state
  const { data: meditationLog, loading: meditationLoading, addDocument: addMeditation, updateDocument: updateMeditation, deleteDocument: deleteMeditation, hasMore: meditationHasMore, loadMore: meditationLoadMore, loadingMore: meditationLoadingMore } = useFirestore<MeditationLog>('meditationLog', { limit: 10 });
  const [meditationSession, setMeditationSession] = React.useState<Partial<MeditationLog>>({ duration: 10 });
  const [meditationTimer, setMeditationTimer] = React.useState(600);
  const [meditationTimerDuration, setMeditationTimerDuration] = React.useState(600);
  const [meditationIsActive, setMeditationIsActive] = React.useState(false);
  const meditationCountRef = React.useRef<NodeJS.Timeout | null>(null);
  const [meditationSaving, setMeditationSaving] = React.useState(false);
  const [meditationDialogOpen, setMeditationDialogOpen] = React.useState(false);

  // Timer functions for breathing
  const startBreathingTimer = () => {
    setBreathingIsActive(true);
    breathingCountRef.current = setInterval(() => {
      setBreathingTimer((timer) => timer - 1);
    }, 1000);
  };

  const pauseBreathingTimer = () => {
    setBreathingIsActive(false);
    if (breathingCountRef.current) {
      clearInterval(breathingCountRef.current);
    }
  };

  const resetBreathingTimer = () => {
    setBreathingIsActive(false);
    if (breathingCountRef.current) {
      clearInterval(breathingCountRef.current);
    }
    setBreathingTimer(300);
  };

  // Timer functions for meditation
  const startMeditationTimer = () => {
    setMeditationIsActive(true);
    meditationCountRef.current = setInterval(() => {
      setMeditationTimer((timer) => timer - 1);
    }, 1000);
  };

  const pauseMeditationTimer = () => {
    setMeditationIsActive(false);
    if (meditationCountRef.current) {
      clearInterval(meditationCountRef.current);
    }
  };

  const resetMeditationTimer = () => {
    setMeditationIsActive(false);
    if (meditationCountRef.current) {
      clearInterval(meditationCountRef.current);
    }
    setMeditationTimer(meditationTimerDuration);
  };

  React.useEffect(() => {
    if (breathingTimer <= 0) {
      pauseBreathingTimer();
    }
  }, [breathingTimer]);

  React.useEffect(() => {
    if (meditationTimer <= 0) {
      pauseMeditationTimer();
      setMeditationTimer(0);
      toast({
        title: "Session Complete!",
        description: "Great job on completing your meditation session.",
      });
    }
  }, [meditationTimer, toast]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (date: Date | Timestamp) => {
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleString();
  };

  // Breathing handlers
  const handleBreathingLog = async () => {
    if (!breathingSession.technique || !breathingSession.duration) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please select a technique and enter a duration.',
      });
      return;
    }
    
    setBreathingSaving(true);
    try {
      if (breathingSession.id) {
        await updateBreathing(breathingSession.id, {
          technique: breathingSession.technique,
          duration: breathingSession.duration,
        });
        toast({ title: "Session updated!" });
      } else {
        await addBreathing({
          technique: breathingSession.technique,
          duration: breathingSession.duration,
          date: new Date().toLocaleDateString(),
        });
        toast({ title: "Breathing session logged!" });
      }
      setBreathingSession({ technique: '4-7-8 Technique', duration: 5 });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to save',
        description: 'Could not save the session. Please try again.',
      });
    } finally {
      setBreathingSaving(false);
    }
  };

  const handleBreathingEdit = (log: BreathingLog) => {
    setBreathingSession(log);
  };

  const handleBreathingDelete = async (id: string) => {
    try {
      await deleteBreathing(id);
      toast({ title: "Session deleted." });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete',
        description: 'Could not delete the session. Please try again.',
      });
    }
  };

  // Meditation handlers
  const handleMeditationLog = async () => {
    if (!meditationSession.title || !meditationSession.duration) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all the fields to log your session.',
      });
      return;
    }
    
    setMeditationSaving(true);
    try {
      if (meditationSession.id) {
        await updateMeditation(meditationSession.id, {
          title: meditationSession.title,
          duration: meditationSession.duration,
        });
        toast({ title: "Session updated!" });
      } else {
        await addMeditation({
          title: meditationSession.title,
          duration: meditationSession.duration,
          date: new Date().toLocaleDateString(),
        });
        toast({ title: "Session logged!" });
      }
      setMeditationSession({ duration: 10 });
      setMeditationDialogOpen(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to save',
        description: 'Could not save session. Please try again.',
      });
    } finally {
      setMeditationSaving(false);
    }
  };

  const handleMeditationEdit = (log: MeditationLog) => {
    setMeditationSession(log);
    setMeditationDialogOpen(true);
  };

  const handleMeditationDelete = async (id: string) => {
    try {
      await deleteMeditation(id);
      toast({ title: "Session deleted." });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to delete',
        description: 'Could not delete session. Please try again.',
      });
    }
  };

  const handleStartMeditation = (durationMinutes: number) => {
    const durationSeconds = durationMinutes * 60;
    setMeditationTimerDuration(durationSeconds);
    setMeditationTimer(durationSeconds);
    setActiveTab('meditation');
    // Scroll to timer section
    setTimeout(() => {
      const timerElement = document.getElementById('meditation-timer');
      if (timerElement) {
        timerElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const meditationTotalMinutes = meditationLog.reduce((sum, session) => sum + session.duration, 0);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Practice & Mindfulness
        </h1>
        <p className="text-muted-foreground">
          Breathing exercises, meditation sessions, and mindfulness resources.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breathing">
            <Wind className="mr-2 h-4 w-4" />
            Breathing
          </TabsTrigger>
          <TabsTrigger value="meditation">
            <BrainCircuit className="mr-2 h-4 w-4" />
            Meditation
          </TabsTrigger>
          <TabsTrigger value="mindfulness">
            <BookOpen className="mr-2 h-4 w-4" />
            Mindfulness
          </TabsTrigger>
        </TabsList>

        {/* Breathing Tab */}
        <TabsContent value="breathing" className="mt-6 space-y-6">
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
                    <p className="text-6xl font-bold tabular-nums">{formatTime(breathingTimer)}</p>
                    <p className="text-muted-foreground">5 minutes</p>
                  </div>
                  <div className="flex w-full gap-4">
                    <Button className="flex-1" size="lg" onClick={breathingIsActive ? pauseBreathingTimer : startBreathingTimer} disabled={breathingTimer <= 0}>
                      {breathingIsActive ? 'Pause' : 'Start'}
                    </Button>
                    <Button className="flex-1" size="lg" variant="outline" onClick={resetBreathingTimer}>
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
                      value={breathingSession.technique}
                      onValueChange={(value) => setBreathingSession({ ...breathingSession, technique: value })}
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
                      value={breathingSession.duration || ''}
                      onChange={(e) => setBreathingSession({ ...breathingSession, duration: Number(e.target.value) })}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleBreathingLog} disabled={breathingSaving}>
                    {breathingSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {breathingSession.id ? 'Save Changes' : 'Log Session'}
                  </Button>
                  {breathingSession.id && <Button variant="ghost" className="ml-2" onClick={() => setBreathingSession({ technique: '4-7-8 Technique', duration: 5 })}>Cancel</Button>}
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Breathing History</CardTitle>
                </CardHeader>
                <CardContent>
                  {breathingLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : breathingLog.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                      <History className="mx-auto h-12 w-12" />
                      <p className="mt-4 font-semibold">No Sessions Logged Yet</p>
                      <p className="text-sm">
                        Complete an exercise to see your history.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {breathingLog.map((log) => (
                        <li key={log.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <p className="font-semibold">{log.technique}</p>
                            <p className="text-sm text-muted-foreground">{log.duration} minutes &bull; {formatDateTime(log.createdAt)}</p>
                          </div>
                          <div className='flex gap-2'>
                            <Button variant="ghost" size="icon" onClick={() => handleBreathingEdit(log)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleBreathingDelete(log.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
                {breathingHasMore && (
                  <CardFooter>
                    <Button onClick={breathingLoadMore} disabled={breathingLoadingMore} className="w-full">
                      {breathingLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Load More
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Meditation Tab */}
        <TabsContent value="meditation" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Sessions This Week"
              value={meditationLog.length.toString()}
              description=""
              icon={Calendar}
            />
            <StatCard
              title="Total Time"
              value={`${meditationTotalMinutes} min`}
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

          <Tabs defaultValue="guided">
            <TabsList>
              <TabsTrigger value="guided">
                <BookOpen className="mr-2 h-4 w-4" />
                Guided Meditations
              </TabsTrigger>
              <TabsTrigger value="timer" id="meditation-timer">
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
                    <p className="text-6xl font-bold tabular-nums">{formatTime(meditationTimer)}</p>
                    <p className="text-muted-foreground">{Math.floor(meditationTimerDuration / 60)} minutes</p>
                  </div>
                  <div className="flex w-full gap-4">
                    <Button className="flex-1" size="lg" onClick={meditationIsActive ? pauseMeditationTimer : startMeditationTimer} disabled={meditationTimer <= 0}>
                      {meditationIsActive ? 'Pause' : 'Start'}
                    </Button>
                    <Button className="flex-1" size="lg" variant="outline" onClick={resetMeditationTimer}>
                      Reset
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="log" className="mt-6">
              <Dialog open={meditationDialogOpen} onOpenChange={setMeditationDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{meditationSession.id ? 'Edit' : 'Log a'} Session</DialogTitle>
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
                        value={meditationSession.title || ''}
                        onChange={(e) => setMeditationSession({ ...meditationSession, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={meditationSession.duration || ''}
                        onChange={(e) => setMeditationSession({ ...meditationSession, duration: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" onClick={() => setMeditationSession({ duration: 10 })}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleMeditationLog} disabled={meditationSaving}>
                      {meditationSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {meditationSession.id ? 'Save Changes' : 'Log Session'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Card className="mx-auto max-w-md">
                <CardHeader>
                  <CardTitle>Log Meditation Session</CardTitle>
                  <CardDescription>
                    Manually log a meditation session you completed.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setMeditationDialogOpen(true)} className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Log Session
                  </Button>
                </CardContent>
              </Card>
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
                  {meditationLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : meditationLog.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                      <History className="mx-auto h-12 w-12" />
                      <p className="mt-4 font-semibold">No Sessions Yet</p>
                      <p className="text-sm">
                        Complete a session to see it logged here.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-4">
                      {meditationLog.map((log) => (
                        <li key={log.id} className="flex items-center justify-between rounded-lg border p-4">
                          <div>
                            <p className="font-semibold">{log.title}</p>
                            <p className="text-sm text-muted-foreground">{log.duration} minutes &bull; {formatDateTime(log.createdAt)}</p>
                          </div>
                          <div className='flex gap-2'>
                            <Button variant="ghost" size="icon" onClick={() => handleMeditationEdit(log)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleMeditationDelete(log.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
                {meditationHasMore && (
                  <CardFooter>
                    <Button onClick={meditationLoadMore} disabled={meditationLoadingMore} className="w-full">
                      {meditationLoadingMore && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Load More
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Mindfulness Tab */}
        <TabsContent value="mindfulness" className="mt-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search for topics, articles, videos..." className="pl-10" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Mindfulness Resources</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                  {resources.map(resource => (
                    <Card key={resource.title} className="flex flex-col">
                      <CardHeader>
                        <div className="relative mb-4 h-40 w-full">
                          <Image
                            src={resource.image}
                            alt={resource.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-lg"
                            data-ai-hint={resource.imageHint}
                          />
                        </div>
                        <Badge variant="outline" className="w-fit">
                          <resource.icon className="mr-2 h-4 w-4" />
                          {resource.type}
                        </Badge>
                        <CardTitle className="pt-2">{resource.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <CardDescription>{resource.description}</CardDescription>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link href={resource.href}>{resource.action}</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quote of the Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <blockquote className="border-l-4 border-primary pl-4 italic">
                    <p>&ldquo;The best way to capture moments is to pay attention. This is how we cultivate mindfulness.&rdquo;</p>
                    <footer className="mt-2 text-sm text-muted-foreground">— Jon Kabat-Zinn</footer>
                  </blockquote>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Exercises</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="#breathing" onClick={() => setActiveTab('breathing')} className="block">
                    <div className="rounded-lg border p-4 hover:bg-muted">
                      <h4 className="font-semibold flex items-center"><Wind className="mr-2 h-4 w-4" />Breathing Exercise</h4>
                      <p className="text-sm text-muted-foreground">Find your calm in 5 minutes.</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/self-love" className="block">
                    <div className="rounded-lg border p-4 hover:bg-muted">
                      <h4 className="font-semibold flex items-center"><BookHeart className="mr-2 h-4 w-4" />Gratitude Journal</h4>
                      <p className="text-sm text-muted-foreground">Quickly note your joys.</p>
                    </div>
                  </Link>
                  <Link href="/dashboard/self-love" className="block">
                    <div className="rounded-lg border p-4 hover:bg-muted">
                      <h4 className="font-semibold flex items-center"><Sparkles className="mr-2 h-4 w-4" />Generate Affirmation</h4>
                      <p className="text-sm text-muted-foreground">Get a boost of inspiration.</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

