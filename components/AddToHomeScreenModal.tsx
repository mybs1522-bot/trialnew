import React, { useState, useEffect } from 'react';
import { Smartphone, Share, PlusSquare, MoreVertical, Download, X, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface AddToHomeScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddToHomeScreenModal: React.FC<AddToHomeScreenModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Detect iOS
    const ua = window.navigator.userAgent;
    const ios = /iPhone|iPad|iPod/.test(ua);
    setIsIOS(ios);

    // Detect if already installed/running in standalone mode
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    setIsStandalone(!!standalone);

    // Capture Android/Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the PWA install prompt');
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Main Dialog */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 text-white rounded-3xl shadow-2xl p-6 overflow-hidden z-10">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4 shadow-lg shadow-orange-500/10">
          <Smartphone size={24} />
        </div>

        <h3 className="text-xl font-extrabold tracking-tight text-white mb-1">
          Add App to Home Screen
        </h3>
        <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
          Open your Student Portal instantly from your phone's home screen — like a native app!
        </p>

        {isStandalone ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-center">
            <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-emerald-400">App is Already Installed!</p>
            <p className="text-xs text-zinc-400 mt-1">You are running Avada Design directly from your Home Screen.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Native Install Button if available (Android/Chrome) */}
            {deferredPrompt && (
              <Button
                onClick={handleInstallClick}
                className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 mb-4"
              >
                <Download size={18} /> Install App Directly
              </Button>
            )}

            {/* iPhone / iOS Instructions */}
            {isIOS ? (
              <div className="bg-zinc-800/80 border border-zinc-700/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                  <Sparkles size={14} /> iPhone & iPad Instructions (Safari):
                </div>
                <ol className="text-xs text-zinc-300 space-y-2.5 pl-1">
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                    <span>Tap the <Share size={15} className="inline text-blue-400 mx-1" /> <strong>Share</strong> button at bottom of Safari.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                    <span>Scroll down & tap <PlusSquare size={15} className="inline text-zinc-300 mx-1" /> <strong>"Add to Home Screen"</strong>.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                    <span>Tap <strong>"Add"</strong> in top right to launch instantly!</span>
                  </li>
                </ol>
              </div>
            ) : (
              /* Android / Chrome Instructions */
              <div className="bg-zinc-800/80 border border-zinc-700/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                  <Sparkles size={14} /> Android Instructions (Chrome / Edge):
                </div>
                <ol className="text-xs text-zinc-300 space-y-2.5 pl-1">
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">1</span>
                    <span>Tap the <MoreVertical size={15} className="inline text-zinc-300 mx-1" /> <strong>3 dots menu</strong> in browser top right.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">2</span>
                    <span>Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-zinc-700 text-white font-bold flex items-center justify-center text-[11px] shrink-0">3</span>
                    <span>Tap <strong>Add</strong> to create instant app icon!</span>
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={onClose}
          variant="outline"
          className="w-full mt-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          Got It
        </Button>
      </div>
    </div>
  );
};
