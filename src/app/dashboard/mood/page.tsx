
'use client';

import {
  BarChart,
  Calendar,
  Smile,
  Zap,
  Star,
  PlusCircle,
  TrendingUp,
  History,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';


const moods = [
  { value: 'Excellent', emoji: '😄' },
  { value: 'Good', emoji: '😊' },
  { value: 'Okay', emoji: '😐' },
  { value: 'Low', emoji: '😔' },
  { value: 'Poor', emoji: '😢' },
];

const energyLevels = [
  { value: 'High' },
  { value: 'Good' },
  { value: 'Moderate' },
  { value: 'Low' },
  { value: 'Exhausted' },
];

const influences = [
  'Work Stress', 'Family Time', 'Good Sleep', 'Social', 'Relaxed', 
  'Anxious', 'Grateful', 'Productive', 'Creative', 'Tired', 'Excited'
];

interface MoodEntry {
  id: string;
  mood: string;
  energy: string;
  influences: string[];
  notes: string;
  date: string;
  createdAt: Timestamp | Date;
}

const defaultMoodState: Partial<MoodEntry> = {
    mood: 'Good',
    energy: 'Moderate',
    influences: [],
    notes: '',
};

export default function MoodTrackerPage() {
    const { data: log, loading, addDocument, updateDocument, deleteDocument, hasMore, loadMore, loadingMore } = useFirestore<MoodEntry>('moodEntries', { limit: 10 });
    const [isSaving, setIsSaving] = React.useState(false);
    const [currentMood, setCurrentMood] = React.useState<Partial<MoodEntry>>(defaultMoodState);
    const { toast } = useToast();
    
    const handleSaveEntry = async () => {
        if (!currentMood.mood || !currentMood.energy) {
            toast({
                variant: 'destructive',
                title: 'Missing fields',
                description: 'Please select your mood and energy level.',
            });
            return;
        }
        
        setIsSaving(true);
        try {
            if (currentMood.id) {
                await updateDocument(currentMood.id, {
                    mood: currentMood.mood,
                    energy: currentMood.energy,
                    influences: currentMood.influences || [],
                    notes: currentMood.notes || '',
                });
                toast({ title: 'Mood Entry Updated!' });
            } else {
                 await addDocument({
                    ...currentMood,
                    date: new Date().toLocaleDateString(),
                } as Omit<MoodEntry, 'id' | 'createdAt'>);

                toast({ title: 'Mood Entry Saved!' });
            }
            setCurrentMood(defaultMoodState);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Failed to save entry',
                description: 'Could not save your mood entry. Please try again.',
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleInfluenceChange = (factor: string, checked: boolean) => {
        const currentFactors = currentMood.influences || [];
        if (checked) {
            setCurrentMood({ ...currentMood, influences: [...currentFactors, factor] });
        } else {
            setCurrentMood({ ...currentMood, influences: currentFactors.filter(f => f !== factor) });
        }
    };
    
    const handleEdit = (entry: MoodEntry) => {
        setCurrentMood(entry);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDocument(id);
            toast({ title: 'Mood entry deleted.' });
        } catch (error) {
            toast({ variant: 'destructive', title: 'Failed to delete entry' });
        }
    };
    
    const formatDateTime = (date: Date | Timestamp) => {
        const d = date instanceof Date ? date : date.toDate();
        return d.toLocaleString();
    }


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Mood Tracker</h1>
        <p className="text-muted-foreground">
          Check in with your emotions to understand your mental landscape.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>{currentMood.id ? 'Edit Mood Entry' : 'How are you feeling?'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <Label className="text-base">Right now, my mood is...</Label>
                        <RadioGroup
                          value={currentMood.mood}
                          onValueChange={(value) => setCurrentMood({...currentMood, mood: value})}
                          className="flex flex-wrap gap-4"
                        >
                          {moods.map((mood) => (
                            <div key={mood.value} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={mood.value}
                                id={`mood-${mood.value.toLowerCase()}`}
                              />
                              <Label htmlFor={`mood-${mood.value.toLowerCase()}`} className="text-lg cursor-pointer">
                                {mood.emoji} {mood.value}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                    </div>

                    <div className="space-y-4">
                        <Label className="text-base">My energy level is...</Label>
                         <RadioGroup
                            value={currentMood.energy}
                            onValueChange={(value) => setCurrentMood({...currentMood, energy: value})}
                            className="flex flex-wrap gap-x-6 gap-y-2"
                        >
                          {energyLevels.map((level) => (
                            <div key={level.value} className="flex items-center space-x-2">
                              <RadioGroupItem
                                value={level.value}
                                id={`energy-${level.value.toLowerCase()}`}
                              />
                              <Label htmlFor={`energy-${level.value.toLowerCase()}`} className="font-normal cursor-pointer">
                                {level.value}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                    </div>
                    <div className="space-y-4">
                        <Label className="text-base">What might be influencing your mood?</Label>
                         <div className="flex flex-wrap gap-4">
                          {influences.map((factor) => (
                            <div
                              key={factor}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox id={factor} checked={currentMood.influences?.includes(factor)} onCheckedChange={(checked) => handleInfluenceChange(factor, !!checked)} />
                              <Label htmlFor={factor} className="font-normal cursor-pointer">
                                {factor}
                              </Label>
                            </div>
                          ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <Label htmlFor="notes" className="text-base">Anything on your mind?</Label>
                        <Textarea
                          id="notes"
                          placeholder="Reflect on your feelings, triggers, and thoughts..."
                          value={currentMood.notes || ''}
                          onChange={(e) => setCurrentMood({...currentMood, notes: e.target.value})}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={handleSaveEntry} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {currentMood.id ? 'Update Entry' : 'Save Mood Entry'}
                        </Button>
                        {currentMood.id && (
                            <Button variant="ghost" onClick={() => setCurrentMood(defaultMoodState)}>
                                Cancel Edit
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mood This Week</CardTitle>
            </CardHeader>
            <CardContent className="flex h-[150px] flex-col items-center justify-center rounded-lg bg-muted text-center">
              <BarChart className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 font-semibold">No Data Yet</p>
              <p className="text-xs text-muted-foreground">Log your mood for a few days to see trends.</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Energy This Week</CardTitle>
            </CardHeader>
            <CardContent className="flex h-[150px] flex-col items-center justify-center rounded-lg bg-muted text-center">
              <Zap className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 font-semibold">No Data Yet</p>
              <p className="text-xs text-muted-foreground">Log your energy levels to see trends.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Mood Insights</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold">{log.length > 0 ? moods.find(m => m.value === log[0].mood)?.emoji : '😊'}</p>
                <p className="text-xs text-muted-foreground">Avg. Mood</p>
              </div>
              <div>
                 <p className="text-2xl font-bold">N/A</p>
                <p className="text-xs text-muted-foreground">Top Factor</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{log.length}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
       <Card>
        <CardHeader>
            <CardTitle>Recent Mood Entries</CardTitle>
        </CardHeader>
        <CardContent>
        {loading ? (
            <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        ) : log.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
            <History className="mx-auto h-12 w-12" />
            <p className="mt-4 font-semibold">No mood entries yet.</p>
            </div>
        ) : (
            <ul className="space-y-4">
            {log.map((entry) => (
                <li key={entry.id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="font-semibold">{moods.find(m => m.value === entry.mood)?.emoji} {entry.mood} mood, {entry.energy} energy</p>
                        <p className="text-sm text-muted-foreground">{formatDateTime(entry.createdAt)}</p>
                        {entry.notes && <p className="mt-2 text-sm">Notes: "{entry.notes}"</p>}
                        {entry.influences.length > 0 && 
                            <div className="mt-2 flex flex-wrap gap-2">
                                {entry.influences.map(inf => <Badge key={inf} variant="secondary">{inf}</Badge>)}
                            </div>
                        }
                    </div>
                     <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
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
  );
}
