
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Bell, Edit, Trash2 } from 'lucide-react';
import * as React from 'react';
import { useReminders } from '@/context/reminders-context';
import type { Reminder } from '@/context/reminders-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function RemindersPage() {
  const { reminders, addReminder, updateReminder, deleteReminder } = useReminders();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [currentReminder, setCurrentReminder] = React.useState<Partial<Reminder>>({});
  const { toast } = useToast();

  const handleSaveReminder = () => {
    if (!currentReminder.title || !currentReminder.time || !currentReminder.frequency) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill out all the fields to set a reminder.',
      });
      return;
    }

    if (currentReminder.id) {
      updateReminder(currentReminder as Reminder);
      toast({ title: 'Reminder Updated!' });
    } else {
      addReminder({
        ...currentReminder,
        id: Date.now(),
      } as Omit<Reminder, 'id'>);
      toast({ title: 'Reminder Set!' });
    }

    setCurrentReminder({});
    setIsDialogOpen(false);
  };

  const handleEdit = (reminder: Reminder) => {
    setCurrentReminder(reminder);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    deleteReminder(id);
    toast({ title: 'Reminder Deleted' });
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground">
            Stay on track with your wellness goals.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentReminder({})}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Reminder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{currentReminder.id ? 'Edit' : 'Set a New'} Reminder</DialogTitle>
              <DialogDescription>
                Create a notification to help you remember your wellness activities.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Reminder Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Drink Water"
                  value={currentReminder.title || ''}
                  onChange={(e) =>
                    setCurrentReminder({ ...currentReminder, title: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={currentReminder.time || ''}
                    onChange={(e) =>
                      setCurrentReminder({ ...currentReminder, time: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency</Label>
                  <Select
                    value={currentReminder.frequency}
                    onValueChange={(value) =>
                      setCurrentReminder({ ...currentReminder, frequency: value })
                    }
                  >
                    <SelectTrigger id="frequency">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekdays">Weekdays</SelectItem>
                      <SelectItem value="weekends">Weekends</SelectItem>
                      <SelectItem value="once">Once</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={() => setCurrentReminder({})}>Cancel</Button>
              </DialogClose>
              <Button onClick={handleSaveReminder}>Save Reminder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Reminders</CardTitle>
          <CardDescription>
            A list of your scheduled wellness reminders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reminders.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Bell className="mx-auto h-12 w-12" />
              <p className="mt-4 font-semibold">No Reminders Set</p>
              <p className="text-sm">
                Click "New Reminder" to create your first one.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {reminders.map((reminder) => (
                <li
                  key={reminder.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold">{reminder.title}</p>
                    <p className="text-sm text-muted-foreground">
                      At {reminder.time} &bull; {reminder.frequency}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(reminder)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(reminder.id)}
                    >
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
  );
}
