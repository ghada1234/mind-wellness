'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }

    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;

    if (isIOS && !isInStandaloneMode) {
      // Show iOS install instructions
      setShowPrompt(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // iOS or manual install
      setShowPrompt(false);
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setDeferredPrompt(null);
      setShowPrompt(false);
      setIsInstalled(true);
    } else {
      console.log('User dismissed the install prompt');
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
    // Store dismissal in localStorage to not show again for a while
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or recently dismissed
  React.useEffect(() => {
    if (isInstalled) {
      setShowPrompt(false);
      return;
    }

    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setShowPrompt(false);
      }
    }
  }, [isInstalled]);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (!showPrompt || isInstalled) {
    return null;
  }

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Install Mind Wellness
          </DialogTitle>
          <DialogDescription>
            {isIOS ? (
              <div className="space-y-2 pt-2">
                <p>Install this app on your iPhone/iPad:</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Tap the Share button <span className="font-mono">□</span> at the bottom</li>
                  <li>Scroll and tap &quot;Add to Home Screen&quot;</li>
                  <li>Tap &quot;Add&quot; to confirm</li>
                </ol>
              </div>
            ) : (
              <p>
                Install Mind Wellness for quick access and a better experience. Works offline and
                loads faster!
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 pt-4">
          {!isIOS && deferredPrompt && (
            <Button onClick={handleInstall} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Install Now
            </Button>
          )}
          <Button variant="outline" onClick={handleDismiss} className="flex-1">
            <X className="mr-2 h-4 w-4" />
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

