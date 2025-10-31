
'use client';

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
  getPersonalizedRecommendations,
  PersonalizedRecommendationsOutput,
  type PersonalizedRecommendationsInput as RecsInput,
} from '@/ai/flows/personalized-recommendations';
import { chatWithAssistant, ChatWithAssistantInput } from '@/ai/flows/wellness-assistant';
import { Loader2, Sparkles, Wand2, BarChart, AlertTriangle, User, Bot, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';


interface ChatMessage {
    role: 'user' | 'model';
    content: { text: string }[];
}

export default function AiHubPage() {
  const [isLoadingRecs, setIsLoadingRecs] = React.useState(true);
  const [recommendations, setRecommendations] = React.useState<PersonalizedRecommendationsOutput | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('recommendations');


  // Chat state
  const [chatHistory, setChatHistory] = React.useState<ChatMessage[]>([
    {
        role: 'model',
        content: [{ text: "Hello! I'm your AI Wellness Assistant. How can I help you understand your data or reach your goals today?" }]
    }
  ]);
  const [userInput, setUserInput] = React.useState('');
  const [isChatLoading, setIsChatLoading] = React.useState(false);
  const chatScrollAreaRef = React.useRef<HTMLDivElement>(null);


  React.useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const mockInput: RecsInput = {
          mood: 'Good',
          sleepDuration: 6.5,
          calorieIntake: 1800,
          workoutTime: 20,
          dailySteps: 4500,
          meditationMinutes: 5,
          journalEntries: ["Felt a bit stressed at work today.", "Grateful for the sunny weather."],
          goals: ['Improve Sleep', 'Be More Active'],
        };
        const result = await getPersonalizedRecommendations(mockInput);
        setRecommendations(result);
      } catch (e) {
        console.error(e);
        setError('Failed to fetch AI recommendations. Please try again later.');
      } finally {
        setIsLoadingRecs(false);
      }
    };
    fetchRecommendations();
  }, []);

  const handleChatSubmit = async (e: React.FormEvent | string) => {
    const message = typeof e === 'string' ? e : userInput;
    if (typeof e !== 'string') {
        e.preventDefault();
    }
    if (!message.trim()) return;

    const newUserMessage: ChatMessage = {
        role: 'user',
        content: [{ text: message }]
    };
    
    setChatHistory(prev => [...prev, newUserMessage]);
    if (typeof e !== 'string') {
        setUserInput('');
    }
    setIsChatLoading(true);

    try {
        const input: ChatWithAssistantInput = {
            history: chatHistory.map(m => ({...m, role: m.role as 'user' | 'model' | 'system' | 'tool' })),
            message: message,
        };
        const responseText = await chatWithAssistant(input);
        
        const newModelMessage: ChatMessage = {
            role: 'model',
            content: [{ text: responseText }]
        };

        setChatHistory(prev => [...prev, newModelMessage]);
    } catch (err) {
        console.error(err);
        const errorMessage: ChatMessage = {
            role: 'model',
            content: [{ text: "I'm sorry, I encountered an error. Please try again." }]
        };
         setChatHistory(prev => [...prev, errorMessage]);
    } finally {
        setIsChatLoading(false);
    }
  };
  
  const handleTellMeMore = (recTitle: string, recDescription: string) => {
    const prompt = `Tell me more about this recommendation: "${recTitle}". Here's the description: "${recDescription}"`;
    setActiveTab('assistant');
    handleChatSubmit(prompt);
  };

  const handleAddToPlan = (recTitle: string) => {
    toast({
        title: 'Added to Plan!',
        description: `"${recTitle}" has been added to your wellness plan.`,
    });
  };

  const getPriorityBadgeVariant = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'secondary';
      case 'Low':
        return 'outline';
      default:
        return 'outline';
    }
  };
  
  React.useEffect(() => {
    if (chatScrollAreaRef.current) {
        chatScrollAreaRef.current.scrollTo({
            top: chatScrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [chatHistory]);


  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">AI Wellness Hub</h1>
        <p className="text-muted-foreground">
          Your intelligent center for personalized insights and recommendations.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="recommendations">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">
            <Sparkles className="mr-2 h-4 w-4" /> Recommendations
          </TabsTrigger>
          <TabsTrigger value="assistant">
            <Wand2 className="mr-2 h-4 w-4" /> AI Assistant
          </TabsTrigger>
          <TabsTrigger value="insights">
            <BarChart className="mr-2 h-4 w-4" /> Insights
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recommendations" className="mt-6">
          {isLoadingRecs && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Generating your personalized recommendations...</p>
              </CardContent>
            </Card>
          )}
          {error && (
            <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive"/> Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
            </Card>
          )}
          {recommendations && (
            <div className="space-y-6">
              {recommendations.recommendations.map((rec, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <CardTitle>{rec.title}</CardTitle>
                         <div className="flex gap-2">
                            <Badge variant={getPriorityBadgeVariant(rec.priority)}>{rec.priority} Priority</Badge>
                            <Badge variant="outline">{rec.impact} Impact</Badge>
                         </div>
                    </div>
                    <CardDescription>Duration: {rec.duration}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{rec.description}</p>
                    <div>
                        <h4 className="font-semibold">Recommended Actions:</h4>
                        <ul className="mt-2 list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            {rec.recommendedActions.map((action, i) => <li key={i}>{action}</li>)}
                        </ul>
                    </div>
                  </CardContent>
                   <CardFooter className="flex flex-wrap gap-2">
                    <Button onClick={() => handleAddToPlan(rec.title)}>Add to Plan</Button>
                    <Button variant="ghost" onClick={() => handleTellMeMore(rec.title, rec.description)}>Tell me more</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
         <TabsContent value="assistant" className="mt-6">
            <Card className="flex flex-col h-[80vh] md:h-[70vh]">
                <CardHeader>
                    <CardTitle>Chat with Wellness AI</CardTitle>
                    <CardDescription>
                        Ask questions, get explanations, and explore your wellness data.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col gap-4">
                     <ScrollArea className="flex-1 pr-4" ref={chatScrollAreaRef}>
                        <div className="space-y-6">
                            {chatHistory.map((message, index) => (
                                <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                    {message.role === 'model' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={`rounded-lg p-3 max-w-xs lg:max-w-md ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm">{message.content.map(c => c.text).join('')}</p>
                                    </div>
                                    {message.role === 'user' && (
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>{user?.email?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                             {isChatLoading && (
                                <div className="flex items-start gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback><Bot className="h-5 w-5"/></AvatarFallback>
                                    </Avatar>
                                    <div className="rounded-lg p-3 bg-muted flex items-center">
                                       <Loader2 className="h-5 w-5 animate-spin"/>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <form onSubmit={handleChatSubmit} className="flex w-full items-center space-x-2">
                        <Input 
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ask about your sleep, mood, or activity..."
                            disabled={isChatLoading}
                        />
                        <Button type="submit" disabled={isChatLoading || !userInput.trim()}>
                            <Send className="h-4 w-4"/>
                            <span className="sr-only">Send</span>
                        </Button>
                    </form>
                </CardFooter>
            </Card>
        </TabsContent>
         <TabsContent value="insights" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The Insights tab is currently being built. Check back later for deep dives into your wellness data.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
