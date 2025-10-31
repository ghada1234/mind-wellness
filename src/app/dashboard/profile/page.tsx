
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User } from 'lucide-react';

const profileFormSchema = z.object({
  age: z.coerce.number().min(1, { message: 'Age is required.' }),
  gender: z.string().min(1, { message: 'Gender is required.' }),
  height: z.coerce.number().min(1, { message: 'Height is required.' }),
  weight: z.coerce.number().min(1, { message: 'Weight is required.' }),
  activityLevel: z
    .string()
    .min(1, { message: 'Activity level is required.' }),
  goal: z.string().min(1, { message: 'Goal is required.' }),
  cuisine: z.string().optional(),
  allergies: z.string().optional(),
  dislikes: z.string().optional(),
  diet: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

const USER_PROFILE_STORAGE_KEY = 'user-nutrition-profile';

export default function ProfilePage() {
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
  });

  React.useEffect(() => {
    try {
      const savedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (savedProfile) {
        const profileData = JSON.parse(savedProfile);
        form.reset(profileData);
      }
    } catch (error) {
      console.error('Failed to load user profile from localStorage', error);
      toast({
          variant: 'destructive',
          title: 'Error Loading Profile',
          description: 'Could not load your saved profile data.',
      })
    }
  }, [form, toast]);

  const onSaveProfile = (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(data));
      toast({
        title: 'Profile Saved!',
        description: 'Your information has been successfully updated.',
      });
    } catch (error) {
      console.error('Failed to save user profile to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error Saving Profile',
        description: 'Could not save your profile data.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
       <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences here.
        </p>
      </div>
      <Card>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSaveProfile)}>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                This data helps us personalize your experience and recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="175" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="70" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Level</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary</SelectItem>
                          <SelectItem value="lightly-active">
                            Lightly Active
                          </SelectItem>
                          <SelectItem value="moderately-active">
                            Moderately Active
                          </SelectItem>
                          <SelectItem value="very-active">
                            Very Active
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weight-loss">
                            Weight Loss
                          </SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance
                          </SelectItem>
                          <SelectItem value="muscle-gain">
                            Muscle Gain
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <h4 className="mb-4 font-medium">
                  Preferences for AI Meal Planner (Optional)
                </h4>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                 <FormField
                  control={form.control}
                  name="cuisine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Cuisine</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Italian, Any" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                  <FormField
                    control={form.control}
                    name="allergies"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allergies</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Peanuts, Shellfish"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dislikes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dislikes</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Mushrooms, Olives"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="diet"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dietary Preference</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Vegan, Keto, Gluten-Free"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isSaving}>
                {isSaving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
