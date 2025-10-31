
'use client';

import {
  Book,
  PlusCircle,
  Sparkles,
  History,
  Edit,
  Trash2,
  Loader2
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';


const reflectionPrompts = [
  'What\'s one small thing that brought you joy today?',
  'Describe a challenge you faced and how you grew from it.',
  'Who are you most grateful for in your life right now, and why?',
  'If you could give your past self one piece of advice, what would it be?',
];

interface JournalEntry {
    id: string;
    content: string;
    createdAt: Timestamp | Date;
}

export default function JournalPage() {
    const { data: entries, loading, addDocument, updateDocument, deleteDocument, hasMore, loadMore, loadingMore } = useFirestore<JournalEntry>('journalLog', { limit: 10 });
    const [currentEntry, setCurrentEntry] = React.useState('');
    const [editingEntry, setEditingEntry] = React.useState<JournalEntry | null>(null);
    const [activeTab, setActiveTab] = React.useState('new-entry');
    const [isSaving, setIsSaving] = React.useState(false);
    const { toast } = useToast();

    const handleSaveEntry = async () => {
        if (!currentEntry.trim()) {
            toast({
                variant: 'destructive',
                title: 'Entry is empty',
                description: 'Please write something before saving.',
            });
            return;
        }

        setIsSaving(true);
        try {
            if (editingEntry) {
                await updateDocument(editingEntry.id, { content: currentEntry });
                toast({ title: 'Journal entry updated!' });
                setEditingEntry(null);
            } else {
                await addDocument({ content: currentEntry });
                toast({ title: 'Journal entry saved!' });
            }
            setCurrentEntry('');
            setActiveTab('recent-entries');
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Failed to save',
                description: 'Could not save the journal entry. Please try again.',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleEdit = (entry: JournalEntry) => {
        setEditingEntry(entry);
        setCurrentEntry(entry.content);
        setActiveTab('new-entry');
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteDocument(id);
            toast({ title: 'Journal entry deleted.' });
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Failed to delete',
                description: 'Could not delete the journal entry. Please try again.',
            });
        }
    };
    
    const handlePromptClick = (prompt: string) => {
        setCurrentEntry(prev => prev ? `${prev}\n\n${prompt}` : prompt);
        setActiveTab('new-entry');
    };
    
    const formatDateTime = (date: Timestamp | Date) => {
        if (date instanceof Date) {
            return date.toLocaleString();
        }
        return date.toDate().toLocaleString();
    };
    
    const dayStreak = React.useMemo(() => {
        if (entries.length === 0) return 0;

        const sortedEntries = [...entries].sort((a, b) => {
            const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate();
            const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate();
            return dateB.getTime() - dateA.getTime();
        });

        let streak = 0;
        let lastDate: Date | null = null;
        const uniqueDates = new Set<string>();

        sortedEntries.forEach(entry => {
            const entryDate = entry.createdAt instanceof Date ? entry.createdAt : entry.createdAt.toDate();
            uniqueDates.add(entryDate.toDateString());
        });
        
        const sortedDates = Array.from(uniqueDates).map(d => new Date(d)).sort((a,b) => b.getTime() - a.getTime());

        if (sortedDates.length === 0) return 0;
        
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        
        if (sortedDates[0].toDateString() !== today.toDateString() && sortedDates[0].toDateString() !== yesterday.toDateString()) {
            return 0;
        }
        
        streak = 1;
        
        for (let i = 0; i < sortedDates.length - 1; i++) {
            const currentDate = sortedDates[i];
            const nextDate = sortedDates[i+1];
            const diffTime = currentDate.getTime() - nextDate.getTime();
            const diffDays = diffTime / (1000 * 3600 * 24);
            
            if (diffDays <= 1) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;

    }, [entries]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Private Journal</h1>
        <p className="text-muted-foreground">
          A safe space to reflect, explore your thoughts, and track your mental
          journey.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="new-entry">
            <TabsList>
              <TabsTrigger value="new-entry">
                <PlusCircle className="mr-2 h-4 w-4" />
                {editingEntry ? 'Edit Entry' : 'New Entry'}
              </TabsTrigger>
              <TabsTrigger value="recent-entries">
                <History className="mr-2 h-4 w-4" />
                Recent Entries</TabsTrigger>
            </TabsList>
            <TabsContent value="new-entry">
              <Card>
                <CardContent className="pt-6">
                  <Textarea
                    placeholder="What's on your mind?"
                    className="min-h-[250px] text-base md:min-h-[400px]"
                    value={currentEntry}
                    onChange={(e) => setCurrentEntry(e.target.value)}
                  />
                </CardContent>
                <CardFooter className="justify-between">
                  <Button onClick={handleSaveEntry} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingEntry ? 'Update Entry' : 'Save Entry'}
                  </Button>
                  {editingEntry && <Button variant="ghost" onClick={() => { setEditingEntry(null); setCurrentEntry(''); }}>Cancel Edit</Button>}
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="recent-entries">
                 <Card>
                    <CardHeader>
                        <CardTitle>Recent Entries</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {loading ? (
                             <div className="flex justify-center items-center h-40">
                                 <Loader2 className="h-8 w-8 animate-spin" />
                             </div>
                         ) : entries.length === 0 ? (
                           <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
                                <Book className="h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">Your journal is empty.</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                Why not write about something you're grateful for today?
                                </p>
                                <Button className="mt-6" onClick={() => setActiveTab('new-entry')}>Write your first entry</Button>
                            </div>
                         ) : (
                             <div className="space-y-4">
                                {entries.map(entry => (
                                    <Card key={entry.id}>
                                        <CardHeader>
                                            <CardDescription>{formatDateTime(entry.createdAt)}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="whitespace-pre-wrap">{entry.content}</p>
                                        </CardContent>
                                        <CardFooter className="gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(entry)}><Edit className="mr-2 h-4 w-4" />Edit</Button>
                                            <Button variant="outline" size="sm" onClick={() => handleDelete(entry.id)}><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                             </div>
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
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Reflection Prompts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {reflectionPrompts.map((prompt, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-4 text-sm text-muted-foreground"
                >
                  <p>“{prompt}”</p>
                  <Button variant="link" className="p-0 h-auto mt-2" onClick={() => handlePromptClick(prompt)}>
                    Write about this
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">{entries.length}</p>
                <p className="text-xs text-muted-foreground">Total Entries</p>
              </div>
              <div>
                <p className="text-3xl font-bold">{dayStreak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI-Powered Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center">
              <p className="text-sm text-muted-foreground">
                Write a few entries and your AI-powered insights will appear here.
              </p>
               <Button variant="secondary" className="mt-4" disabled={entries.length < 3}>
                  Analyze My Journal
                </Button>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
               <p>✨ Consistent Growth Mindset</p>
               <p>💖 Gratitude as a Recurring Theme</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
