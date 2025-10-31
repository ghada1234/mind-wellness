
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  Share2,
  AlertCircle,
  Dumbbell,
  Flame,
  Bed,
  Star,
  CalendarDays,
  Utensils,
  Smile,
  Download,
} from 'lucide-react';
import type { ChartConfig } from '@/components/ui/chart';
import { useToast } from '@/hooks/use-toast';

const activityData = [
  { day: 'Wed', minutes: 0 },
  { day: 'Thu', minutes: 0 },
  { day: 'Fri', minutes: 0 },
  { day: 'Sat', minutes: 0 },
  { day: 'Sun', minutes: 0 },
  { day: 'Mon', minutes: 0 },
  { day: 'Tue', minutes: 0 },
];
const activityChartConfig = {
  minutes: { label: 'Minutes', color: 'hsl(var(--chart-1))' },
} satisfies ChartConfig;

const sleepData = [
  { date: 'Sep 3', hours: 0 },
  { date: 'Sep 4', hours: 0 },
  { date: 'Sep 5', hours: 0 },
  { date: 'Sep 6', hours: 0 },
  { date: 'Sep 7', hours: 0 },
  { date: 'Sep 8', hours: 0 },
  { date: 'Sep 9', hours: 0 },
];
const sleepChartConfig = {
  hours: { label: 'Hours', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

const nutritionData = [
  { day: 'Wed', calories: 0 },
  { day: 'Thu', calories: 0 },
  { day: 'Fri', calories: 0 },
  { day: 'Sat', calories: 0 },
  { day: 'Sun', calories: 0 },
  { day: 'Mon', calories: 0 },
  { day: 'Tue', calories: 0 },
];
const nutritionChartConfig = {
  calories: { label: 'Calories', color: 'hsl(var(--chart-3))' },
} satisfies ChartConfig;

const moodData = [
  { day: 'Wed', mood: 3 }, // 3 for 'Okay'
  { day: 'Thu', mood: 4 }, // 4 for 'Good'
  { day: 'Fri', mood: 3 },
  { day: 'Sat', mood: 5 }, // 5 for 'Excellent'
  { day: 'Sun', mood: 4 },
  { day: 'Mon', mood: 2 }, // 2 for 'Low'
  { day: 'Tue', mood: 4 },
];

const moodLevels: { [key: number]: string } = {
  1: 'Poor',
  2: 'Low',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
};

const moodChartConfig = {
  mood: { label: 'Mood' },
  Excellent: { label: 'Excellent', color: 'hsl(var(--chart-1))' },
  Good: { label: 'Good', color: 'hsl(var(--chart-2))' },
  Okay: { label: 'Okay', color: 'hsl(var(--chart-3))' },
  Low: { label: 'Low', color: 'hsl(var(--chart-4))' },
  Poor: { label: 'Poor', color: 'hsl(var(--chart-5))' },
} satisfies ChartConfig;

const generateReportText = () => {
    let report = `*✨ Your Weekly Wellness Report ✨*\n\n`;

    report += `*📊 Summary*\n`;
    report += `--------------------\n`;
    report += `💪 *Total Activity:* 0 min\n`;
    report += `🔥 *Calories Burned:* 0\n`;
    report += `🥗 *Avg. Calories:* 0 kcal\n`;
    report += `😊 *Avg. Mood:* N/A\n`;
    report += `😴 *Avg. Sleep:* 0.0 h\n`;
    report += `⭐ *Avg. Sleep Quality:* 0.0/5\n`;
    report += `🗓️ *Active Days:* 0\n\n`;

    report += `*📈 Weekly Trends*\n`;
    report += `--------------------\n`;

    report += `*💪 Activity (minutes):*\n`;
    activityData.forEach(d => {
        report += `  • ${d.day}: ${d.minutes} min\n`;
    });

    report += `\n*😴 Sleep (hours):*\n`;
    sleepData.forEach(d => {
        report += `  • ${d.date}: ${d.hours} hrs\n`;
    });

    report += `\n*🥗 Nutrition (calories):*\n`;
    nutritionData.forEach(d => {
        report += `  • ${d.day}: ${d.calories} kcal\n`;
    });

    report += `\n*😊 Mood:*\n`;
    moodData.forEach(d => {
        report += `  • ${d.day}: ${moodLevels[d.mood]}\n`;
    });

    report += `\n_This is a sample report. Track your data daily for accurate insights._`;
    return report;
};

export default function WellnessReportPage() {
    const { toast } = useToast();

    const handleShareReport = () => {
        const summary = generateReportText();
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(summary)}`;
        window.open(whatsappUrl, '_blank');
    };
    
    const handleDownloadReport = () => {
        const text = generateReportText();
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wellness-report.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Wellness Report
          </h1>
          <p className="text-muted-foreground">
            An overview of your activity, sleep, nutrition, and mood data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="weekly">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-6 md:grid-cols-4">
              <div className="flex items-center gap-4">
                <Dumbbell className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">0 min</p>
                  <p className="text-sm text-muted-foreground">Total Activity</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Flame className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Calories Burned</p>
                </div>
              </div>
               <div className="flex items-center gap-4">
                <Utensils className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Avg. Calories</p>
                </div>
              </div>
               <div className="flex items-center gap-4">
                <Smile className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">N/A</p>
                  <p className="text-sm text-muted-foreground">Avg. Mood</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Bed className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">0.0 h</p>
                  <p className="text-sm text-muted-foreground">Avg. Sleep</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Star className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">0.0/5</p>
                  <p className="text-sm text-muted-foreground">Avg. Quality</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <CalendarDays className="h-8 w-8 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">0 Days</p>
                  <p className="text-sm text-muted-foreground">Active Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
             <Card>
              <CardHeader>
                <CardTitle>Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={activityChartConfig} className="h-[200px] w-full">
                  <RechartsBarChart data={activityData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis domain={[0, 4]} hide/>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="minutes" fill="var(--color-minutes)" radius={4} />
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Sleep</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={sleepChartConfig} className="h-[200px] w-full">
                  <RechartsBarChart data={sleepData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis domain={[0, 12]} hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                     <Bar dataKey="hours" fill="var(--color-hours)" radius={4} />
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Nutrition</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={nutritionChartConfig} className="h-[200px] w-full">
                  <RechartsBarChart data={nutritionData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis domain={[0, 2200]} hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                     <Bar dataKey="calories" fill="var(--color-calories)" radius={4} />
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
             <Card>
              <CardHeader>
                <CardTitle>Mood</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={moodChartConfig} className="h-[200px] w-full">
                  <RechartsBarChart data={moodData} accessibilityLayer>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
                    <YAxis domain={[1, 5]} hide />
                    <ChartTooltip 
                        content={<ChartTooltipContent 
                            formatter={(value) => moodLevels[value as keyof typeof moodLevels]}
                            nameKey="mood"
                        />} 
                    />
                    <ChartLegend content={<ChartLegendContent payload={Object.values(moodChartConfig).filter(c => c.label !== 'Mood').map(c => ({value: c.label, type: 'square', color: c.color}))} />} />
                     <Bar dataKey="mood" radius={4}>
                      {moodData.map((entry, index) => {
                          const moodLevel = moodLevels[entry.mood as keyof typeof moodLevels];
                          const color = moodChartConfig[moodLevel as keyof typeof moodChartConfig]?.color;
                          return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                     </Bar>
                  </RechartsBarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Health Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <h4 className="font-semibold">Health Conditions</h4>
                    <p className="text-sm text-muted-foreground">
                        No health conditions listed. You can add them on your profile page to get more personalized insights.
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Logs</CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple">
                        <AccordionItem value="activity">
                            <AccordionTrigger>Activity Log</AccordionTrigger>
                            <AccordionContent>
                                <div className="text-center text-muted-foreground p-4">
                                    <AlertCircle className="mx-auto h-8 w-8" />
                                    <p className="mt-2 text-sm">No activity logged for this period.</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="sleep">
                            <AccordionTrigger>Sleep Log</AccordionTrigger>
                            <AccordionContent>
                                <div className="text-center text-muted-foreground p-4">
                                    <AlertCircle className="mx-auto h-8 w-8" />
                                    <p className="mt-2 text-sm">No sleep logged for this period.</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="nutrition">
                            <AccordionTrigger>Nutrition Log</AccordionTrigger>
                            <AccordionContent>
                                <div className="text-center text-muted-foreground p-4">
                                    <AlertCircle className="mx-auto h-8 w-8" />
                                    <p className="mt-2 text-sm">No nutrition logged for this period.</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="mood">
                            <AccordionTrigger>Mood Log</AccordionTrigger>
                            <AccordionContent>
                                <div className="text-center text-muted-foreground p-4">
                                    <AlertCircle className="mx-auto h-8 w-8" />
                                    <p className="mt-2 text-sm">No mood logged for this period.</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Export & Share</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full" onClick={handleDownloadReport}>
                        <Download className="mr-2 h-4 w-4" />
                        Download Report
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleShareReport}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Share to WhatsApp
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
