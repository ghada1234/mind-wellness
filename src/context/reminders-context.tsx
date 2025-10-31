
'use client';

import * as React from 'react';

export interface Reminder {
  id: number;
  title: string;
  time: string;
  frequency: string;
}

interface RemindersContextType {
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: number) => void;
}

const RemindersContext = React.createContext<RemindersContextType | undefined>(undefined);

export const RemindersProvider = ({ children }: { children: React.ReactNode }) => {
  const [reminders, setReminders] = React.useState<Reminder[]>([]);

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder = { ...reminder, id: Date.now() };
    setReminders((prev) => [...prev, newReminder]);
  };

  const updateReminder = (updatedReminder: Reminder) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === updatedReminder.id ? updatedReminder : r))
    );
  };

  const deleteReminder = (id: number) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  const value = { reminders, addReminder, updateReminder, deleteReminder };

  return (
    <RemindersContext.Provider value={value}>
      {children}
    </RemindersContext.Provider>
  );
};

export const useReminders = () => {
  const context = React.useContext(RemindersContext);
  if (context === undefined) {
    throw new Error('useReminders must be used within a RemindersProvider');
  }
  return context;
};
