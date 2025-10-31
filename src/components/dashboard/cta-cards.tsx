
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Smile, BookText } from 'lucide-react';
import Link from 'next/link';

export function CtaCards() {
  return (
    <>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smile />
            Log Your Mood
          </CardTitle>
          <CardDescription>
            Check in with your emotions to understand your mental landscape.
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto">
          <Button asChild className="w-full">
            <Link href="/dashboard/mood">
              Log Mood
              <ArrowRight />
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookText />
            Write in your Journal
          </CardTitle>
          <CardDescription>
            Reflect on your day, your thoughts, and your feelings.
          </CardDescription>
        </CardHeader>
        <CardFooter className="mt-auto">
          <Button asChild className="w-full">
            <Link href="/dashboard/journal">
              Start Writing
              <ArrowRight />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
