
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import {
  PlusCircle,
  Brain,
  BarChart,
  Droplets,
  Flame,
  Fish,
  Wheat,
  Beef,
  CakeSlice,
  Apple,
  Salad,
  Soup,
  Cookie,
  Camera,
  Search,
  ScanLine,
  Loader2,
  AlertTriangle,
  Sparkles,
  User,
  Share2,
  Heart,
  Download,
  Plus,
  Minus,
  Trash2,
  Edit,
} from 'lucide-react';
import { analyzeFoodPhoto, AnalyzeFoodPhotoOutput } from '@/ai/flows/analyze-food-photo';
import { generateMealPlan, GenerateMealPlanOutput, GenerateMealPlanInput } from '@/ai/flows/generate-meal-plan';
import { getFoodRecommendationsByMood, FoodRecommendationsByMoodOutput } from '@/ai/flows/food-recommendations-by-mood';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useFirestore } from '@/hooks/use-firestore';
import type { Timestamp } from 'firebase/firestore';
import { useWaterIntake } from '@/hooks/use-water-intake';

type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  sugar: number;
  sodium: number;
  fiber: number;
}

interface MealEntry {
  id: string;
  type: MealType;
  items: FoodItem[];
  createdAt: Timestamp | Date;
}

const mealTypeDetails = [
  {
    type: 'Breakfast' as MealType,
    icon: Flame,
    emoji: '🥞',
    description: 'No entries for Breakfast today.',
  },
  {
    type: 'Lunch' as MealType,
    icon: Salad,
    emoji: '🥗',
    description: 'No entries for Lunch today.',
  },
  {
    type: 'Dinner' as MealType,
    icon: Soup,
    emoji: '🍲',
    description: 'No entries for Dinner today.',
  },
  {
    type: 'Snack' as MealType,
    icon: Apple,
    emoji: '🍎',
    description: 'No entries for Snack today.',
  },
  {
    type: 'Dessert' as MealType,
    icon: CakeSlice,
    emoji: '🍰',
    description: 'No entries for Dessert today.',
  },
];

const mealTypes: { value: MealType; label: string; emoji: string }[] = [
  { value: 'Breakfast', label: 'Breakfast', emoji: '🥞' },
  { value: 'Lunch', label: 'Lunch', emoji: '🥗' },
  { value: 'Dinner', label: 'Dinner', emoji: '🍲' },
  { value: 'Snack', label: 'Snack', emoji: '🍎' },
  { value: 'Dessert', label: 'Dessert', emoji: '🍰' },
];

const plannerFormSchema = z.object({
    duration: z.coerce.number().min(1, { message: "Plan duration is required." }),
});

type PlannerFormData = z.infer<typeof plannerFormSchema>;

const USER_PROFILE_STORAGE_KEY = 'user-nutrition-profile';

interface SavedMealPlan {
  id: string;
  createdAt: Timestamp | Date;
  duration: number;
  plan: GenerateMealPlanOutput;
}

const mealEmojis: { [key: string]: string } = {
  'breakfast': '🥞',
  'lunch': '🥗',
  'dinner': '🍲',
};

const generatePlanText = (plan: GenerateMealPlanOutput, duration: number) => {
    let text = `✨ Your Personalized ${duration}-Day Meal Plan ✨\n\n`;
    plan.plan.forEach(day => {
        text += `====================\n`;
        text += `🗓️ **${day.day}**\n`;
        text += `====================\n\n`;
        (['breakfast', 'lunch', 'dinner'] as const).forEach(mealType => {
            const meal = day[mealType];
            const emoji = mealEmojis[mealType] || '🍽️';
            text += `--- ${emoji} **${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${meal.name}** ---\n`;
            text += `_${meal.description}_\n\n`;
            text += `**Ingredients:**\n- ${meal.ingredients.join('\n- ')}\n\n`;
            text += `**Instructions:**\n${meal.instructions}\n\n`;
            text += `*Nutrition:* ${meal.calories.toFixed(0)} kcal | ${meal.protein.toFixed(1)}g protein | ${meal.carbohydrates.toFixed(1)}g carbs | ${meal.fat.toFixed(1)}g fat\n\n`;
        });
        text += `--- **📊 Daily Totals** ---\n`;
        text += `*Calories:* ${day.dailyTotals.calories.toFixed(0)} kcal\n`;
        text += `*Protein:* ${day.dailyTotals.protein.toFixed(1)}g\n`;
        text += `*Carbohydrates:* ${day.dailyTotals.carbohydrates.toFixed(1)}g\n`;
        text += `*Fat:* ${day.dailyTotals.fat.toFixed(1)}g\n\n`;
    });
    return text;
};

interface MoodEntry {
  id: string;
  mood: string;
  energy: string;
  notes?: string;
  date?: string;
}

export default function NutritionTrackerPage() {
  const { data: mealEntries, addDocument: addMealEntry, deleteDocument: deleteMealEntry } = useFirestore<MealEntry>('mealEntries', { daily: true });
  const { data: savedPlans, addDocument: addSavedPlan, deleteDocument: deleteSavedPlan, loading: savedPlansLoading } = useFirestore<SavedMealPlan>('savedMealPlans');
  const { data: moodData } = useFirestore<MoodEntry>('moodEntries');
  const { waterIntake, updateWaterIntake, loading: waterLoading } = useWaterIntake();


  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<AnalyzeFoodPhotoOutput | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);
  const [selectedMealType, setSelectedMealType] = React.useState<MealType>('Breakfast');
  const [isGeneratingPlan, setIsGeneratingPlan] = React.useState(false);
  const [mealPlan, setMealPlan] = React.useState<GenerateMealPlanOutput | null>(null);
  const [activeTab, setActiveTab] = React.useState('today');
  const [isLoadingMoodRecommendations, setIsLoadingMoodRecommendations] = React.useState(false);
  const [moodRecommendations, setMoodRecommendations] = React.useState<FoodRecommendationsByMoodOutput | null>(null);
  const [moodRecommendationsError, setMoodRecommendationsError] = React.useState<string | null>(null);

  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const form = useForm<PlannerFormData>({
    resolver: zodResolver(plannerFormSchema),
    defaultValues: {
      duration: 7,
    }
  });

  // Fetch food recommendations based on mood when insights tab is opened
  React.useEffect(() => {
    if (activeTab === 'insights' && moodData.length > 0 && !moodRecommendations && !isLoadingMoodRecommendations) {
      const fetchMoodRecommendations = async () => {
        setIsLoadingMoodRecommendations(true);
        setMoodRecommendationsError(null);
        try {
          const latestMood = moodData[0]; // Latest mood entry
          const result = await getFoodRecommendationsByMood({
            mood: latestMood.mood,
            energy: latestMood.energy,
            notes: latestMood.notes,
          });
          setMoodRecommendations(result);
        } catch (error) {
          console.error('Error fetching mood-based recommendations:', error);
          setMoodRecommendationsError('Failed to load food recommendations. Please try again.');
          toast({
            variant: 'destructive',
            title: 'Failed to Load Recommendations',
            description: 'Could not generate food recommendations based on your mood.',
          });
        } finally {
          setIsLoadingMoodRecommendations(false);
        }
      };
      fetchMoodRecommendations();
    }
  }, [activeTab, moodData, moodRecommendations, isLoadingMoodRecommendations, toast]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setPhotoPreview(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const photoDataUri = reader.result as string;
      setPhotoPreview(photoDataUri);
      try {
        const result = await analyzeFoodPhoto({ photoDataUri });
        setAnalysisResult(result);
      } catch (error) {
        console.error('Error analyzing food photo:', error);
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: 'Could not analyze the photo. Please try another image.',
        });
        setPhotoPreview(null);
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      toast({
        variant: 'destructive',
        title: 'File Error',
        description: 'Could not read the selected file.',
      });
      setIsAnalyzing(false);
      setPhotoPreview(null);
    };
  };

  const handleLogWithPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleConfirmMeal = async () => {
    if (!analysisResult) return;

    try {
        await addMealEntry({
            type: selectedMealType,
            items: analysisResult.foodItems,
        });
        setAnalysisResult(null);
        setPhotoPreview(null);
        toast({
        title: 'Meal Logged!',
        description: `Your ${selectedMealType} has been added to your daily intake.`,
        });
    } catch (error) {
        toast({
            variant: 'destructive',
            title: 'Failed to Log Meal',
            description: 'Could not save your meal. Please try again.',
        });
    }
  };

  const handleCancelAnalysis = () => {
    setAnalysisResult(null);
    setPhotoPreview(null);
  };
  
   const handleDeleteMealEntry = async (id: string) => {
    try {
      await deleteMealEntry(id);
      toast({ title: 'Meal entry deleted.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Delete',
        description: 'Could not delete meal entry.',
      });
    }
  };


  const onGeneratePlanSubmit = async (data: PlannerFormData) => {
    setIsGeneratingPlan(true);
    setMealPlan(null);
    try {
      const savedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (!savedProfile) {
        toast({
          variant: 'destructive',
          title: 'Profile Not Found',
          description: 'Please set up your profile before generating a meal plan.',
        });
        setIsGeneratingPlan(false);
        return;
      }
      const profileData = JSON.parse(savedProfile);
      
      const fullData: GenerateMealPlanInput = {
        ...profileData,
        duration: data.duration,
      }

      const result = await generateMealPlan(fullData);
      setMealPlan(result);
       toast({
        title: "Meal Plan Generated!",
        description: `Your personalized ${data.duration}-day meal plan is ready.`,
      });
    } catch (error) {
        console.error('Error generating meal plan:', error);
        toast({
            variant: 'destructive',
            title: 'Failed to Generate Plan',
            description: 'An unexpected error occurred. Please try again.',
        });
    } finally {
        setIsGeneratingPlan(false);
    }
  };
  
  const handleSavePlan = async () => {
    if (!mealPlan) return;
    try {
        await addSavedPlan({
            duration: form.getValues('duration'),
            plan: mealPlan,
        });
        toast({
            title: 'Plan Saved!',
            description: 'Your meal plan has been saved successfully.',
        });
        setActiveTab('saved-plans');
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Failed to Save Plan',
        description: 'Could not save your meal plan.',
      });
    }
  };
  
    const handleDeleteSavedPlan = async (id: string) => {
    try {
      await deleteSavedPlan(id);
      toast({ title: 'Saved plan deleted.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to Delete',
        description: 'Could not delete saved plan.',
      });
    }
  };

  
  const handleSharePlan = () => {
    if (!mealPlan) return;
    const text = generatePlanText(mealPlan, form.getValues('duration'));
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadPlan = () => {
    if (!mealPlan) return;
    const text = generatePlanText(mealPlan, form.getValues('duration'));
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meal-plan.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const mealsByType = React.useMemo(() => {
    return mealEntries.reduce((acc, entry) => {
        if (!acc[entry.type]) {
            acc[entry.type] = [];
        }
        acc[entry.type].push(entry);
        return acc;
    }, {} as Record<MealType, MealEntry[]>);
  }, [mealEntries]);

  const totals = React.useMemo(() => {
    return mealEntries.flatMap((m) => m.items).reduce(
      (acc, item) => {
        acc.calories += item.calories;
        acc.protein += item.protein;
        acc.carbohydrates += item.carbohydrates;
        acc.fat += item.fat;
        acc.fiber += item.fiber;
        acc.sugar += item.sugar;
        acc.sodium += item.sodium;
        return acc;
      },
      { calories: 0, protein: 0, carbohydrates: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 }
    );
  }, [mealEntries]);

  const calorieGoal = 2000;
  const calorieProgress = Math.min((totals.calories / calorieGoal) * 100, 100);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Nutrition Tracker</h1>
        <p className="text-muted-foreground">
          Log your meals, track your intake, and discover nutritional insights.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <TabsList className="h-auto flex-wrap justify-start sm:h-10 sm:flex-nowrap sm:justify-center">
            <TabsTrigger value="today">Today&apos;s Intake</TabsTrigger>
            <TabsTrigger value="insights">
              <BarChart className="mr-2 h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="planner">
              <Brain className="mr-2 h-4 w-4" />
              AI Planner
            </TabsTrigger>
            <TabsTrigger value="saved-plans">
              <Heart className="mr-2 h-4 w-4" />
              Saved
            </TabsTrigger>
          </TabsList>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Food
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a Meal</DialogTitle>
                <DialogDescription>Log food by photo, search, or scanning a nutrition label.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-3">
                  <Label>Meal Type</Label>
                  <RadioGroup defaultValue={selectedMealType} onValueChange={(value) => setSelectedMealType(value as MealType)} className="flex flex-wrap gap-4">
                    {mealTypes.map((meal) => (
                      <div key={meal.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={meal.value} id={meal.value} />
                        <Label htmlFor={meal.value} className="flex items-center gap-2 cursor-pointer">
                          <span>{meal.emoji}</span>
                          {meal.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogWithPhotoClick} disabled={isAnalyzing}>
                    {isAnalyzing ? <Loader2 className="animate-spin" /> : <Camera />}
                    {isAnalyzing ? 'Analyzing...' : 'Log with Photo'}
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Search />
                    Log with Search
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ScanLine />
                    Scan Nutrition Label
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={!!analysisResult} onOpenChange={(open) => !open && handleCancelAnalysis()}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Confirm Your Meal for {selectedMealType}</DialogTitle>
                <DialogDescription>Here&apos;s what our AI found in your photo. Confirm to add it to your log.</DialogDescription>
              </DialogHeader>
              {analysisResult && (
                <div className="max-h-[60vh] space-y-4 overflow-y-auto p-1">
                  {photoPreview && (
                    <div className="relative aspect-video w-full overflow-hidden rounded-md">
                      <Image src={photoPreview} alt="Uploaded meal" layout="fill" objectFit="cover" />
                    </div>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Food</TableHead>
                        <TableHead className="text-right">Calories</TableHead>
                        <TableHead className="text-right">Protein</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysisResult.foodItems.map((item) => (
                        <TableRow key={item.name}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="text-right">{item.calories.toFixed(0)}</TableCell>
                          <TableCell className="text-right">{item.protein.toFixed(1)}g</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={handleCancelAnalysis}>Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleConfirmMeal}>Confirm</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <TabsContent value="today" className="mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Accordion type="multiple" defaultValue={['Breakfast']} className="w-full">
                {mealTypeDetails.map((meal) => (
                  <AccordionItem key={meal.type} value={meal.type}>
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{meal.emoji}</span>
                        {meal.type}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <CardContent className="pt-6">
                          {!mealsByType[meal.type] || mealsByType[meal.type].length === 0 ? (
                            <div className="text-center text-muted-foreground">
                              <meal.icon className="mx-auto h-10 w-10" />
                              <p className="mt-4">{meal.description}</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {mealsByType[meal.type].map((entry) => (
                                <Card key={entry.id} className="relative">
                                  <div className="absolute top-2 right-2 flex gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      onClick={() => handleDeleteMealEntry(entry.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  <CardContent className="pt-6">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead>Food</TableHead>
                                          <TableHead className="text-right">Calories</TableHead>
                                          <TableHead className="text-right">Protein</TableHead>
                                          <TableHead className="text-right">Carbs</TableHead>
                                          <TableHead className="text-right">Fat</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {entry.items.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell className="text-right">{item.calories.toFixed(0)}</TableCell>
                                            <TableCell className="text-right">{item.protein.toFixed(1)}g</TableCell>
                                            <TableCell className="text-right">{item.carbohydrates.toFixed(1)}g</TableCell>
                                            <TableCell className="text-right">{item.fat.toFixed(1)}g</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Summary</CardTitle>
                  <CardDescription>Your total intake for today against your goals.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold">{totals.calories.toFixed(0)}</p>
                    <p className="text-sm text-muted-foreground">Goal: {calorieGoal} kcal</p>
                    <Progress value={calorieProgress} className="mt-2 h-2" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Macronutrients</h4>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Fish className="h-4 w-4 text-primary" />
                        <span>Protein</span>
                      </div>
                      <span className="text-muted-foreground">{totals.protein.toFixed(1)}g / 150g</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Wheat className="h-4 w-4 text-primary" />
                        <span>Carbohydrates</span>
                      </div>
                      <span className="text-muted-foreground">{totals.carbohydrates.toFixed(1)}g / 250g</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        <Beef className="h-4 w-4 text-primary" />
                        <span>Fat</span>
                      </div>
                      <span className="text-muted-foreground">{totals.fat.toFixed(1)}g / 67g</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold">Micronutrients</h4>
                    <div className="flex justify-between">
                      <span>Fiber</span>
                      <span className="text-muted-foreground">{totals.fiber.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sugar</span>
                      <span className="text-muted-foreground">{totals.sugar.toFixed(1)}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sodium</span>
                      <span className="text-muted-foreground">{totals.sodium.toFixed(0)}mg</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                  <CardTitle>Water Intake</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateWaterIntake(Math.max(0, waterIntake.glasses - 1))}
                    disabled={waterIntake.glasses === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-4">
                    <Droplets className="h-8 w-8 text-blue-500" />
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {waterLoading ? (
                          <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                          `${waterIntake.glasses} / ${waterIntake.goal}`
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">glasses</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => updateWaterIntake(waterIntake.glasses + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="insights" className="mt-6">
          <div className="space-y-6">
            {/* Mood-Based Food Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Food Recommendations Based on Your Mood
                </CardTitle>
                <CardDescription>
                  {moodData.length > 0 
                    ? `Personalized food recommendations for your current mood: ${moodData[0].mood}`
                    : 'Log your mood to get personalized food recommendations'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {moodData.length === 0 ? (
                  <div className="flex h-[200px] flex-col items-center justify-center gap-4 text-center">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                    <div className="space-y-1">
                      <h3 className="font-semibold">No Mood Data</h3>
                      <p className="text-sm text-muted-foreground">
                        Log your mood in the Mood Tracker to get personalized food recommendations.
                      </p>
                      <Button asChild className="mt-4">
                        <Link href="/dashboard/mood">
                          Go to Mood Tracker
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : isLoadingMoodRecommendations ? (
                  <div className="flex h-[200px] flex-col items-center justify-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Generating personalized food recommendations...
                    </p>
                  </div>
                ) : moodRecommendationsError ? (
                  <div className="flex h-[200px] flex-col items-center justify-center gap-4 text-center">
                    <AlertTriangle className="h-12 w-12 text-destructive" />
                    <div className="space-y-1">
                      <h3 className="font-semibold">Error</h3>
                      <p className="text-sm text-muted-foreground">
                        {moodRecommendationsError}
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={async () => {
                          setIsLoadingMoodRecommendations(true);
                          setMoodRecommendationsError(null);
                          try {
                            const latestMood = moodData[0];
                            const result = await getFoodRecommendationsByMood({
                              mood: latestMood.mood,
                              energy: latestMood.energy,
                              notes: latestMood.notes,
                            });
                            setMoodRecommendations(result);
                          } catch (error) {
                            console.error('Error fetching mood-based recommendations:', error);
                            setMoodRecommendationsError('Failed to load food recommendations. Please try again.');
                          } finally {
                            setIsLoadingMoodRecommendations(false);
                          }
                        }}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : moodRecommendations ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm text-muted-foreground">
                        {moodRecommendations.explanation}
                      </p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      {moodRecommendations.recommendations.map((rec, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-lg">{rec.name}</CardTitle>
                            <CardDescription>{rec.description}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <h4 className="text-sm font-semibold mb-1">Key Benefits:</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                {rec.nutrients.map((nutrient, i) => (
                                  <li key={i}>{nutrient}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Serving:</span>
                              <span className="font-medium">{rec.serving}</span>
                            </div>
                            {rec.timing && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Best Time:</span>
                                <span className="font-medium">{rec.timing}</span>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        setIsLoadingMoodRecommendations(true);
                        setMoodRecommendations(null);
                        setMoodRecommendationsError(null);
                        try {
                          const latestMood = moodData[0];
                          const result = await getFoodRecommendationsByMood({
                            mood: latestMood.mood,
                            energy: latestMood.energy,
                            notes: latestMood.notes,
                          });
                          setMoodRecommendations(result);
                        } catch (error) {
                          console.error('Error fetching mood-based recommendations:', error);
                          setMoodRecommendationsError('Failed to load food recommendations. Please try again.');
                        } finally {
                          setIsLoadingMoodRecommendations(false);
                        }
                      }}
                    >
                      Refresh Recommendations
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Weekly Report */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Report</CardTitle>
                <CardDescription>A summary of your nutrition over the last seven days.</CardDescription>
              </CardHeader>
              <CardContent className="flex h-[300px] flex-col items-center justify-center gap-4 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                <div className="space-y-1">
                  <h3 className="font-semibold">Not Enough Data</h3>
                  <p className="text-sm text-muted-foreground">
                    Log your nutrition for at least 3 days to see AI-powered insights here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="planner" className="mt-6">
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                            Your meal plan is generated based on your profile. Edit your details on the profile page.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button asChild>
                            <Link href="/dashboard/profile">
                                <User className="mr-2 h-4 w-4" />
                                Go to Profile
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                <Card>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onGeneratePlanSubmit)}>
                            <CardHeader>
                            <CardTitle>AI Meal Planner</CardTitle>
                            <CardDescription>
                                Generate a personalized meal plan based on your profile and goals.
                            </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <FormField control={form.control} name="duration" render={({ field }) => (
                                    <FormItem><FormLabel>Plan Duration</FormLabel><Select onValueChange={field.onChange} value={String(field.value)}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="1">Daily (1 Day)</SelectItem>
                                            <SelectItem value="7">Weekly (7 Days)</SelectItem>
                                            <SelectItem value="30">Monthly (30 Days)</SelectItem>
                                        </SelectContent>
                                    </Select><FormMessage /></FormItem>
                                )} />
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={isGeneratingPlan}>
                                    {isGeneratingPlan && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Generate Plan
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            </div>

            {isGeneratingPlan && (
                <Card className="mt-6">
                    <CardContent className="flex flex-col items-center justify-center p-12">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Your personalized meal plan is being generated...</p>
                    </CardContent>
                </Card>
            )}

            {mealPlan && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Sparkles className="text-primary"/> Your {form.getValues('duration')}-Day Meal Plan</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="multiple" defaultValue={['Day 1']} className="w-full">
                            {mealPlan.plan.map(day => (
                                <AccordionItem value={day.day} key={day.day}>
                                    <AccordionTrigger className="text-xl font-bold">{day.day}</AccordionTrigger>
                                    <AccordionContent className="space-y-4">
                                        {(['breakfast', 'lunch', 'dinner'] as const).map(mealType => {
                                            const meal = day[mealType];
                                            return (
                                                <Card key={meal.name}>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <span>{mealEmojis[mealType]}</span>
                                                            {meal.name}
                                                        </CardTitle>
                                                        <CardDescription>{meal.description}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="font-semibold">Ingredients</h4>
                                                                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                                                                    {meal.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold">Instructions</h4>
                                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2">{meal.instructions}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                                            <span><strong>Calories:</strong> {meal.calories.toFixed(0)}</span>
                                                            <span><strong>Protein:</strong> {meal.protein.toFixed(1)}g</span>
                                                            <span><strong>Carbs:</strong> {meal.carbohydrates.toFixed(1)}g</span>
                                                            <span><strong>Fat:</strong> {meal.fat.toFixed(1)}g</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                        <Card className="bg-muted">
                                            <CardHeader>
                                                <CardTitle>Daily Totals</CardTitle>
                                                <CardDescription>Estimated nutritional summary for {day.day}.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-semibold">
                                                <span><strong>Calories:</strong> {day.dailyTotals.calories.toFixed(0)}</span>
                                                <span><strong>Protein:</strong> {day.dailyTotals.protein.toFixed(1)}g</span>
                                                <span><strong>Carbs:</strong> {day.dailyTotals.carbohydrates.toFixed(1)}g</span>
                                                <span><strong>Fat:</strong> {day.dailyTotals.fat.toFixed(1)}g</span>
                                            </CardContent>
                                        </Card>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                    <CardFooter className="flex flex-wrap gap-2">
                        <Button onClick={handleSavePlan}>
                            <Heart className="mr-2 h-4 w-4" />
                            Save Plan
                        </Button>
                        <Button variant="outline" onClick={handleDownloadPlan}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                        </Button>
                        <Button variant="outline" onClick={handleSharePlan}>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share via WhatsApp
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </TabsContent>
        <TabsContent value="saved-plans" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Saved Meal Plans</CardTitle>
              <CardDescription>
                Revisit your personalized meal plans at any time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {savedPlansLoading ? (
                 <div className="flex justify-center items-center h-40">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : savedPlans.length === 0 ? (
                <div className="flex h-[300px] flex-col items-center justify-center gap-4 text-center">
                  <Heart className="h-12 w-12 text-muted-foreground" />
                  <div className="space-y-1">
                    <h3 className="font-semibold">No Saved Plans Yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate a plan in the "AI Meal Planner" tab and save it to see it here.
                    </p>
                  </div>
                </div>
              ) : (
                <Accordion type="multiple" className="w-full">
                  {savedPlans.map((savedPlan) => (
                    <AccordionItem value={String(savedPlan.id)} key={savedPlan.id}>
                      <AccordionTrigger className="text-lg font-semibold">
                         <div className="flex-1 text-left">
                            {savedPlan.duration}-Day Plan <Badge variant="outline" className="ml-2">Created: {new Date( (savedPlan.createdAt as Timestamp).seconds * 1000).toLocaleDateString()}</Badge>
                         </div>
                      </AccordionTrigger>
                      <AccordionContent>
                         <div className="space-y-4">
                            <div className="flex gap-2">
                               <Button variant="outline" size="sm" disabled>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Plan
                               </Button>
                               <Button variant="destructive" size="sm" onClick={() => handleDeleteSavedPlan(savedPlan.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete Plan
                               </Button>
                            </div>
                           {savedPlan.plan.plan.map(day => (
                                <Card key={day.day}>
                                    <CardHeader>
                                      <CardTitle>{day.day}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {(['breakfast', 'lunch', 'dinner'] as const).map(mealType => {
                                            const meal = day[mealType];
                                            return (
                                                <Card key={meal.name}>
                                                    <CardHeader>
                                                        <CardTitle className="flex items-center gap-2">
                                                            <span>{mealEmojis[mealType]}</span>
                                                            {meal.name}
                                                        </CardTitle>
                                                        <CardDescription>{meal.description}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <h4 className="font-semibold">Ingredients</h4>
                                                                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                                                                    {meal.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold">Instructions</h4>
                                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-2">{meal.instructions}</p>
                                                            </div>
                                                        </div>
                                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                                            <span><strong>Calories:</strong> {meal.calories.toFixed(0)}</span>
                                                            <span><strong>Protein:</strong> {meal.protein.toFixed(1)}g</span>
                                                            <span><strong>Carbs:</strong> {meal.carbohydrates.toFixed(1)}g</span>
                                                            <span><strong>Fat:</strong> {meal.fat.toFixed(1)}g</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                        <Card className="bg-muted">
                                            <CardHeader>
                                                <CardTitle>Daily Totals</CardTitle>
                                                <CardDescription>Estimated nutritional summary for {day.day}.</CardDescription>
                                            </CardHeader>
                                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-semibold">
                                                <span><strong>Calories:</strong> {day.dailyTotals.calories.toFixed(0)}</span>
                                                <span><strong>Protein:</strong> {day.dailyTotals.protein.toFixed(1)}g</span>
                                                <span><strong>Carbs:</strong> {day.dailyTotals.carbohydrates.toFixed(1)}g</span>
                                                <span><strong>Fat:</strong> {day.dailyTotals.fat.toFixed(1)}g</span>
                                            </CardContent>
                                        </Card>
                                    </CardContent>
                                </Card>
                            ))}
                         </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
