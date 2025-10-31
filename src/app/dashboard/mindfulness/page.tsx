
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, BookOpen, Video, Wind, BookHeart, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const resources = [
  {
    type: 'Article',
    icon: BookOpen,
    title: 'Getting Started with Mindfulness',
    description: 'A beginner\'s guide to the core principles of mindfulness and how to start your practice.',
    action: 'Read More',
    href: '#',
    image: 'https://picsum.photos/400/250',
    imageHint: 'mindfulness guide',
  },
  {
    type: 'Video',
    icon: Video,
    title: '10-Minute Guided Body Scan',
    description: 'A short video to guide you through a relaxing body scan meditation.',
    action: 'Watch Now',
    href: '#',
    image: 'https://picsum.photos/400/250',
    imageHint: 'body scan',
  },
  {
    type: 'Article',
    icon: BookOpen,
    title: 'The Art of Mindful Communication',
    description: 'Learn how to listen and speak with more presence and compassion.',
    action: 'Read More',
    href: '#',
    image: 'https://picsum.photos/400/250',
    imageHint: 'communication mindful',
  },
  {
    type: 'Article',
    icon: BookOpen,
    title: 'Mindful Eating for a Healthier Life',
    description: 'Discover how to bring awareness to your meals and improve your relationship with food.',
    action: 'Read More',
    href: '/dashboard/nutrition',
    image: 'https://picsum.photos/400/250',
    imageHint: 'mindful eating',
  },
   {
    type: 'Video',
    icon: Video,
    title: 'Guided Morning Meditation',
    description: 'Start your day with intention and clarity with this gentle guided session.',
    action: 'Watch Now',
    href: '/dashboard/meditation',
    image: 'https://picsum.photos/400/250',
    imageHint: 'morning meditation',
  },
   {
    type: 'Article',
    icon: BookOpen,
    title: 'The Power of Gratitude',
    description: 'An article exploring the science-backed benefits of a regular gratitude practice.',
    action: 'Read More',
    href: '/dashboard/self-love',
    image: 'https://picsum.photos/400/250',
    imageHint: 'gratitude power',
  },
];

export default function MindfulnessPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Mindfulness Hub</h1>
        <p className="text-muted-foreground">
          Explore resources to help you stay present and grounded.
        </p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search for topics, articles, videos..." className="pl-10" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
                <CardTitle>Mindfulness Resources</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                {resources.map(resource => (
                    <Card key={resource.title} className="flex flex-col">
                        <CardHeader>
                           <div className="relative mb-4 h-40 w-full">
                                <Image
                                src={resource.image}
                                alt={resource.title}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-lg"
                                data-ai-hint={resource.imageHint}
                                />
                            </div>
                            <Badge variant="outline" className="w-fit">
                                <resource.icon className="mr-2 h-4 w-4" />
                                {resource.type}
                            </Badge>
                            <CardTitle className="pt-2">{resource.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <CardDescription>{resource.description}</CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button asChild className="w-full">
                                <Link href={resource.href}>{resource.action}</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quote of the Day</CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="border-l-4 border-primary pl-4 italic">
                <p>&ldquo;The best way to capture moments is to pay attention. This is how we cultivate mindfulness.&rdquo;</p>
                <footer className="mt-2 text-sm text-muted-foreground">— Jon Kabat-Zinn</footer>
              </blockquote>
            </CardContent>
          </Card>
           <Card>
            <CardHeader>
              <CardTitle>Quick Exercises</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <Link href="/dashboard/breathing" className="block">
                <div className="rounded-lg border p-4 hover:bg-muted">
                  <h4 className="font-semibold flex items-center"><Wind className="mr-2 h-4 w-4" />Breathing Exercise</h4>
                  <p className="text-sm text-muted-foreground">Find your calm in 5 minutes.</p>
                </div>
              </Link>
               <Link href="/dashboard/self-love" className="block">
                <div className="rounded-lg border p-4 hover:bg-muted">
                  <h4 className="font-semibold flex items-center"><BookHeart className="mr-2 h-4 w-4" />Gratitude Journal</h4>
                  <p className="text-sm text-muted-foreground">Quickly note your joys.</p>
                </div>
              </Link>
                <Link href="/dashboard/self-love" className="block">
                <div className="rounded-lg border p-4 hover:bg-muted">
                  <h4 className="font-semibold flex items-center"><Sparkles className="mr-2 h-4 w-4" />Generate Affirmation</h4>
                  <p className="text-sm text-muted-foreground">Get a boost of inspiration.</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
