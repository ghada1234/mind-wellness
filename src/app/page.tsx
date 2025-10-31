
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Target, Brain, BarChart, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-card shadow-sm">
        <Link href="/" className="flex items-center justify-center" prefetch={false}>
          <Logo />
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
           <Link href="/auth/sign-in">
              <Button variant="ghost">Sign In</Button>
           </Link>
            <Link href="/auth/sign-up">
              <Button>Sign Up</Button>
            </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Find Your Inner Peace
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Rediscover Your Well-being. An AI-powered companion to help you
                    track your mood, sleep, and activities, providing insights to
                    find your inner peace.
                  </p>
                </div>
              </div>
              <Image
                src="https://picsum.photos/600/400"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="wellness yoga"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  All The Tools You Need
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A single app to track, analyze, and improve your complete
                  wellness.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-primary" />
                      Track Your Wellness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Log your mood, sleep, nutrition, and activities to get a
                      full picture of your health.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-6 w-6 text-primary" />
                      AI-Powered Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Get personalized recommendations from our smart assistant
                      to help you in your journey.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-6 w-6 text-primary" />
                      Achieve Your Goals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Set and track your wellness goals, from drinking more
                      water to meditating daily.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-6 w-6 text-primary" />
                      Stay Motivated
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Earn badges and see your progress to stay inspired on
                      your path to wellness.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Image
                src="https://picsum.photos/550/550"
                width="550"
                height="550"
                alt="Features"
                data-ai-hint="dashboard analytics"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                How It Works
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                A simple, three-step process to a better you.
              </p>
            </div>
            <div className="mx-auto w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-12 w-12 text-2xl font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold">Track Your Day</h3>
                <p className="text-muted-foreground">
                  Effortlessly log your daily activities, moods, and meals in
                  just a few taps.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-12 w-12 text-2xl font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold">Get AI Insights</h3>
                <p className="text-muted-foreground">
                  Our intelligent assistant analyzes your patterns and provides
                  personalized tips.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="flex items-center justify-center rounded-full bg-primary text-primary-foreground h-12 w-12 text-2xl font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold">Follow Your Plan</h3>
                <p className="text-muted-foreground">
                  Use your insights to build a personalized wellness plan and
                  see your progress.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container px-4 md:px-6">
            <Image
              src="https://picsum.photos/1200/600"
              width={1200}
              height={600}
              alt="App Screenshot"
              data-ai-hint="app screenshot"
              className="mx-auto aspect-[2/1] overflow-hidden rounded-xl object-cover"
            />
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
        <p className="text-xs text-muted-foreground">
          &copy; 2025 Find Your Inner Peace. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Service
          </Link>
        </nav>
      </footer>
    </div>
  );
}
