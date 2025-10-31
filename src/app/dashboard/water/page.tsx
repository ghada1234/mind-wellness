
'use client';

import { Droplets, History, Edit, Trash2, Loader2, Calendar } from 'lucide-react';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';

interface WaterIntakeLog {
  id: string;
  glasses: number;
  goal: number;
  date: string;
  createdAt: Timestamp | Date;
}

const formSchema = z.object({
  glasses: z.coerce.number().min(0, 'Must be a positive number'),
  goal: z.coerce.number().min(1, 'Goal must be at least 1'),
  date: z.string().nonempty('Date is required'),
});

type FormData = z.infer<typeof formSchema>;

const getTodayDateString = () => {
    return new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};


export default function WaterLogPage() {
  const { data: waterLog, loading, addDocument, updateDocument, deleteDocument } = useFirestore<WaterIntakeLog>('waterIntake', { limit: 50 });
  const [isSaving, setIsSaving] = React.useState(false);
  const [editingLog, setEditingLog] = React.useState<WaterIntakeLog | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      glasses: 8,
      goal: 8,
      date: getTodayDateString(),
    },
  });
  
  React.useEffect(() => {
    if (editingLog) {
      form.reset({
        glasses: editingLog.glasses,
        goal: editingLog.goal,
        date: editingLog.date,
      });
    } else {
        form.reset({
            glasses: 8,
            goal: 8,
            date: getTodayDateString(),
        });
    }
  }, [editingLog, form]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      if (editingLog) {
        await updateDocument(editingLog.id, {
          glasses: data.glasses,
          goal: data.goal,
          date: data.date,
        });
        toast({ title: 'Water log updated!' });
        setEditingLog(null);
      } else {
        await addDocument({
          glasses: data.glasses,
          goal: data.goal,
          date: data.date,
        } as Omit<WaterIntakeLog, 'id' | 'createdAt'>);
        toast({ title: 'Water log saved!' });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to save',
        description: 'Could not save the water log. Please try again.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (log: WaterIntakeLog) => {
    setEditingLog(log);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument(id);
      toast({ title: 'Water log deleted.' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Failed to delete log' });
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Water Log</h1>
        <p className="text-muted-foreground">
          Track and manage your daily water intake history.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader>
                  <CardTitle>{editingLog ? 'Edit Entry' : 'Add New Entry'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="glasses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Glasses of Water</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="goal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Daily Goal (Glasses)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="e.g., 7/25/2024" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingLog ? 'Save Changes' : 'Add Entry'}
                  </Button>
                  {editingLog && <Button variant="ghost" onClick={() => setEditingLog(null)}>Cancel</Button>}
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : waterLog.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <History className="mx-auto h-12 w-12" />
                  <p className="mt-4 font-semibold">No water intake logged yet.</p>
                  <p className="text-sm">
                    Go to the Nutrition page to track your water today.
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {waterLog.map((log) => (
                    <li key={log.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-4">
                         <Droplets className="h-6 w-6 text-blue-500" />
                         <div>
                            <p className="font-semibold">{log.glasses} / {log.goal} glasses</p>
                            <p className="text-sm text-muted-foreground">{log.date}</p>
                         </div>
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
          </Card>
        </div>
      </div>
    </div>
  );
}
