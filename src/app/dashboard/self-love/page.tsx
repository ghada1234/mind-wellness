
'use client';

import {
  Heart,
  Sparkles,
  Leaf,
  BarChart,
  PlusCircle,
  RefreshCcw,
  Star,
  Edit,
  Trash2,
  CheckCircle,
  MessageSquarePlus,
  BookHeart,
  Loader2,
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';


const dailyAffirmations = [
  "I am worthy of love and kindness, especially from myself.",
  "I am enough just as I am.",
  "I release the need for self-criticism and embrace self-compassion.",
  "I am growing and learning every day.",
  "I have the power to create the life I desire.",
];

interface Affirmation {
  id: string;
  text: string;
  createdAt: Timestamp | Date;
}

interface GratitudeEntry {
    id: string;
    text: string;
    date: string;
    createdAt: Timestamp | Date;
}

interface CompletedActivity {
    id: string;
    text: string;
    createdAt: Timestamp | Date;
}


const selfCareActivities = [
    { emoji: '🛁', text: 'Take a relaxing bath or shower.', duration: '20 min' },
    { emoji: '🚶‍♀️', text: 'Go for a mindful 15-minute walk.', duration: '15 min' },
    { emoji: '🧘‍♀️', text: 'Do a 10-minute stretching session.', duration: '10 min' },
    { emoji: '🫁', text: 'Practice deep breathing for 5 minutes.', duration: '5 min' },
    { emoji: '📚', text: 'Read a chapter of a book for fun.', duration: '30 min' },
    { emoji: '🎵', text: 'Listen to a favorite uplifting playlist.', duration: '15 min' },
    { emoji: '🧘', text: 'Meditate for 10 minutes.', duration: '10 min' },
    { emoji: '✍️', text: 'Write in your journal for 15 minutes.', duration: '15 min' },
    { emoji: '📞', text: 'Call or message a loved one.', duration: '20 min' },
    { emoji: '🙏', text: 'Write down 3 things you\'re grateful for.', duration: '5 min' },
    { emoji: '😄', text: 'Watch a funny video or show.', duration: '25 min' },
    { emoji: '🎨', text: 'Do something creative for 45 minutes.', duration: '45 min' },
    { emoji: '💻', text: 'Schedule a video chat with a friend.', duration: '30 min' },
    { emoji: '💌', text: 'Send a kind message to someone.', duration: '5 min' },
    { emoji: '👥', text: 'Engage with a community or group.', duration: '60 min' },
    { emoji: '🤝', text: 'Spend time volunteering.', duration: '120 min' },
];


export default function SelfLovePage() {
  const { data: personalAffirmations, loading: affirmationsLoading, addDocument: addAffirmation, updateDocument: updateAffirmation, deleteDocument: deleteAffirmation, hasMore: hasMoreAffirmations, loadMore: loadMoreAffirmations, loadingMore: loadingMoreAffirmations } = useFirestore<Affirmation>('affirmationsLog', { limit: 10 });
  const { data: gratitudeEntries, loading: gratitudeLoading, addDocument: addGratitudeEntry, deleteDocument: deleteGratitudeEntry, hasMore: hasMoreGratitude, loadMore: loadMoreGratitude, loadingMore: loadingMoreGratitude } = useFirestore<GratitudeEntry>('gratitudeLog', { limit: 10 });
  const { data: completedActivities, addDocument: addCompletedActivity, deleteDocument: deleteCompletedActivity } = useFirestore<CompletedActivity>('selfCareLog', { daily: true });

  const [currentAffirmationIndex, setCurrentAffirmationIndex] = React.useState(0);
  const [isAffirmationDialogOpen, setIsAffirmationDialogOpen] = React.useState(false);
  const [currentEditableAffirmation, setCurrentEditableAffirmation] = React.useState<Partial<Affirmation>>({});
  const [currentGratitudeEntry, setCurrentGratitudeEntry] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const { toast } = useToast();
  
  const formatDateTime = (date: Date | Timestamp) => {
    const d = date instanceof Date ? date : date.toDate();
    return d.toLocaleString();
  }

  const handleNewAffirmation = () => {
    const newIndex = (currentAffirmationIndex + 1) % dailyAffirmations.length;
    setCurrentAffirmationIndex(newIndex);
  };

  const handleSaveAffirmation = async () => {
    if (!currentEditableAffirmation.text?.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Affirmation',
        description: 'Please enter some text for your affirmation.',
      });
      return;
    }
    
    setIsSaving(true);
    try {
        if (currentEditableAffirmation.id) {
          await updateAffirmation(currentEditableAffirmation.id, { text: currentEditableAffirmation.text });
          toast({ title: 'Affirmation updated!' });
        } else {
          await addAffirmation({ text: currentEditableAffirmation.text });
          toast({ title: 'Affirmation added!' });
        }
        setCurrentEditableAffirmation({});
        setIsAffirmationDialogOpen(false);
    } catch (error) {
         toast({ variant: 'destructive', title: 'Failed to save affirmation' });
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleSaveGratitudeEntry = async () => {
    if (!currentGratitudeEntry.trim()) {
        toast({
            variant: 'destructive',
            title: 'Empty Entry',
            description: "Please write something you're grateful for.",
        });
        return;
    }

    setIsSaving(true);
    try {
        await addGratitudeEntry({
            text: currentGratitudeEntry,
            date: new Date().toLocaleDateString(),
        });
        setCurrentGratitudeEntry('');
        toast({ title: 'Gratitude entry saved!' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to save gratitude entry' });
    } finally {
        setIsSaving(false);
    }
  };
  
  const handleDeleteGratitudeEntry = async (id: string) => {
    try {
      await deleteGratitudeEntry(id);
      toast({ title: 'Gratitude entry deleted.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to delete gratitude entry' });
    }
  };

  const handleEdit = (affirmation: Affirmation) => {
    setCurrentEditableAffirmation(affirmation);
    setIsAffirmationDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
        await deleteAffirmation(id);
        toast({ title: 'Affirmation deleted.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to delete affirmation' });
    }
  };
  
  const handleCompleteActivity = async (activityText: string) => {
    const existingActivity = completedActivities.find(a => a.text === activityText);
    if (existingActivity) {
        try {
            await deleteCompletedActivity(existingActivity.id);
            toast({ title: "Activity undone."});
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to undo activity' });
        }
    } else {
        try {
            await addCompletedActivity({ text: activityText });
            toast({ title: "Great job on your self-care!" });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to complete activity' });
        }
    }
  };
  
  const handleDeleteCompletedActivity = async (id: string) => {
      try {
        await deleteCompletedActivity(id);
        toast({ title: 'Activity progress cleared.' });
      } catch (error) {
        toast({ variant: 'destructive', title: 'Failed to clear activity' });
      }
  };

  const completedActivityTexts = React.useMemo(() => completedActivities.map(a => a.text), [completedActivities]);


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Self-Love & Care</h1>
        <p className="text-muted-foreground">
          Cultivate compassion and kindness for yourself with these practices.
        </p>
      </div>

      <Tabs defaultValue="affirmations">
        <TabsList>
          <TabsTrigger value="affirmations">
            <Heart className="mr-2 h-4 w-4" /> Affirmations
          </TabsTrigger>
          <TabsTrigger value="self-care">
            <Sparkles className="mr-2 h-4 w-4" /> Self-Care
          </TabsTrigger>
          <TabsTrigger value="gratitude">
            <Leaf className="mr-2 h-4 w-4" /> Gratitude
          </TabsTrigger>
          <TabsTrigger value="insights">
            <BarChart className="mr-2 h-4 w-4" /> Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="affirmations" className="mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Today's Affirmation</CardTitle>
                <CardDescription>
                  Use this as a mantra for your day.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center text-center p-6">
                <p className="text-2xl font-semibold italic">
                  &ldquo;{dailyAffirmations[currentAffirmationIndex]}&rdquo;
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" onClick={handleNewAffirmation}>
                  <RefreshCcw className="mr-2 h-4 w-4" /> New Affirmation
                </Button>
                <Button>
                  <Star className="mr-2 h-4 w-4" /> Save to Favorites
                </Button>
              </CardFooter>
            </Card>

            <Dialog open={isAffirmationDialogOpen} onOpenChange={setIsAffirmationDialogOpen}>
              <Card>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>Your Personal Affirmations</CardTitle>
                    <CardDescription>
                      Create and manage affirmations that resonate with you.
                    </CardDescription>
                  </div>
                  <DialogTrigger asChild>
                     <Button size="sm" onClick={() => setCurrentEditableAffirmation({})}>
                       <PlusCircle className="mr-2 h-4 w-4" /> Add
                    </Button>
                  </DialogTrigger>
                </CardHeader>
                <CardContent>
                  {affirmationsLoading ? (
                     <div className="flex justify-center items-center h-40">
                         <Loader2 className="h-8 w-8 animate-spin" />
                     </div>
                  ) : personalAffirmations.length === 0 ? (
                    <div className="flex h-full min-h-[150px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center">
                      <p className="font-semibold">No personal affirmations yet.</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Click 'Add' to create your own powerful affirmations.
                      </p>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      {personalAffirmations.map((affirmation) => (
                        <li key={affirmation.id} className="flex items-center justify-between rounded-lg border p-3">
                           <p className="flex-1 text-sm">{affirmation.text}</p>
                           <div className="flex gap-1">
                               <Button variant="ghost" size="icon" onClick={() => handleEdit(affirmation)}>
                                    <Edit className="h-4 w-4" />
                               </Button>
                               <Button variant="ghost" size="icon" onClick={() => handleDelete(affirmation.id)}>
                                    <Trash2 className="h-4 w-4" />
                               </Button>
                           </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
                {hasMoreAffirmations && (
                  <CardFooter>
                    <Button onClick={loadMoreAffirmations} disabled={loadingMoreAffirmations} className="w-full">
                      {loadingMoreAffirmations && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Load More
                    </Button>
                  </CardFooter>
                )}
              </Card>

               <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{currentEditableAffirmation.id ? 'Edit' : 'Add New'} Affirmation</DialogTitle>
                    <DialogDescription>
                       Write an affirmation that empowers you.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                     <Label htmlFor="affirmation-text" className="sr-only">Affirmation</Label>
                     <Input
                        id="affirmation-text"
                        placeholder="e.g., I am capable of amazing things."
                        value={currentEditableAffirmation.text || ''}
                        onChange={(e) => setCurrentEditableAffirmation({ ...currentEditableAffirmation, text: e.target.value })}
                     />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" onClick={() => setCurrentEditableAffirmation({})}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSaveAffirmation} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Affirmation
                    </Button>
                  </DialogFooter>
                </DialogContent>
            </Dialog>
          </div>
        </TabsContent>
        <TabsContent value="self-care" className="mt-6">
            <div className="space-y-6">
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {selfCareActivities.map((activity, index) => {
                        const isCompleted = completedActivityTexts.includes(activity.text);
                        return (
                            <Card key={index} className="flex flex-col">
                                <CardContent className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                                    <p className="text-4xl">{activity.emoji}</p>
                                    <p className="mt-4 font-medium">{activity.text}</p>
                                    <Badge variant="secondary" className="mt-2">{activity.duration}</Badge>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={isCompleted ? "secondary" : "default"}
                                        onClick={() => handleCompleteActivity(activity.text)}
                                    >
                                        {isCompleted && <CheckCircle className="mr-2 h-4 w-4" />}
                                        {isCompleted ? 'Done!' : 'Do'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
                 <Card>
                    <CardHeader>
                        <CardTitle>Today's Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {completedActivities.length === 0 ? (
                        <p className="text-muted-foreground">No self-care activities completed today.</p>
                      ) : (
                        <ul className="space-y-2">
                           {completedActivities.map((activity) => (
                             <li key={activity.id} className="flex items-center justify-between rounded-lg border p-2">
                               <p className="text-sm"> <CheckCircle className="inline-block mr-2 h-4 w-4 text-green-500" />{activity.text}</p>
                               <Button variant="ghost" size="icon" onClick={() => handleDeleteCompletedActivity(activity.id)}>
                                 <Trash2 className="h-4 w-4" />
                               </Button>
                             </li>
                           ))}
                        </ul>
                      )}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
        <TabsContent value="gratitude" className="mt-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Gratitude Reflection</CardTitle>
                        <CardDescription>Take a moment to appreciate the good things in your life.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Label htmlFor="gratitude-entry">What are you grateful for today?</Label>
                        <Textarea 
                            id="gratitude-entry"
                            placeholder="Today, I'm grateful for..."
                            className="mt-2 min-h-[150px]"
                            value={currentGratitudeEntry}
                            onChange={(e) => setCurrentGratitudeEntry(e.target.value)}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveGratitudeEntry} disabled={isSaving}>
                             {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <MessageSquarePlus className="mr-2 h-4 w-4" />
                            New Entry
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Gratitude Entries</CardTitle>
                    </CardHeader>
                    <CardContent>
                    {gratitudeLoading ? (
                        <div className="flex justify-center items-center h-40">
                             <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : gratitudeEntries.length === 0 ? (
                        <div className="text-center text-muted-foreground py-12">
                            <BookHeart className="mx-auto h-12 w-12" />
                            <p className="mt-4 font-semibold">No Gratitude Entries Yet</p>
                            <p className="text-sm">
                                Add your first gratitude entry to see it here.
                            </p>
                        </div>
                    ) : (
                        <ul className="space-y-4">
                        {gratitudeEntries.map((entry) => (
                            <li key={entry.id} className="rounded-lg border p-4 relative group">
                                <p className="text-sm text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
                                <p className="mt-1">{entry.text}</p>
                                 <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100" onClick={() => handleDeleteGratitudeEntry(entry.id)}>
                                     <Trash2 className="h-4 w-4" />
                                 </Button>
                            </li>
                        ))}
                        </ul>
                    )}
                    </CardContent>
                    {hasMoreGratitude && (
                        <CardFooter>
                            <Button onClick={loadMoreGratitude} disabled={loadingMoreGratitude} className="w-full">
                                {loadingMoreGratitude && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Load More
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </TabsContent>
         <TabsContent value="insights" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                 <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Affirmations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{personalAffirmations.length}</p>
                        <p className="text-sm text-muted-foreground">Saved</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Self-Care Acts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{completedActivities.length}</p>
                        <p className="text-sm text-muted-foreground">Today</p>
                    </CardContent>
                </Card>
                <Card className="text-center">
                    <CardHeader>
                        <CardTitle>Gratitude</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{gratitudeEntries.length}</p>
                        <p className="text-sm text-muted-foreground">Total</p>
                    </CardContent>
                </Card>
            </div>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Your Self-Love Journey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Heart className="h-5 w-5 flex-shrink-0 text-primary" />
                        <div>
                            <h4 className="font-semibold">Growing Self-Compassion</h4>
                            <p className="text-sm text-muted-foreground">Your saved affirmations show a commitment to positive self-talk.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Sparkles className="h-5 w-5 flex-shrink-0 text-primary" />
                        <div>
                            <h4 className="font-semibold">Consistent Care</h4>
                            <p className="text-sm text-muted-foreground">You're actively participating in self-care. Every small act matters.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Leaf className="h-5 w-5 flex-shrink-0 text-primary" />
                        <div>
                            <h4 className="font-semibold">Embracing Positive Self-Talk</h4>
                            <p className="text-sm text-muted-foreground">Gratitude is a powerful tool for shifting perspective. You're using it well.</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-sm italic text-muted-foreground">You're doing beautifully. Self-love is a practice, not a destination. Be patient with yourself.</p>
                </CardFooter>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
