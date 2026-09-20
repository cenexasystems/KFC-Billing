"use client";

import React, { useEffect, useState } from "react";
import { Download, RefreshCw, Share, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export default function PwaClient() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [hasUpdate, setHasUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Service Worker Registration (Production only)
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      if (process.env.NODE_ENV === "production") {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[PWA] Service Worker registered:", registration.scope);

            // Check if there is already a waiting worker
            if (registration.waiting) {
              setWaitingWorker(registration.waiting);
              setHasUpdate(true);
            }

            // Listen for new service worker being installed
            registration.addEventListener("updatefound", () => {
              const newWorker = registration.installing;
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    setWaitingWorker(newWorker);
                    setHasUpdate(true);
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.error("[PWA] Service Worker registration failed:", err);
          });

        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      }
    }

    // 2. Handle beforeinstallprompt (Android / Desktop Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 3. Handle App Installed event
    const handleAppInstalled = () => {
      setCanInstall(false);
      setInstallPrompt(null);
      console.log("[PWA] App successfully installed");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    // 4. Detect iOS Safari (not in standalone mode)
    if (typeof window !== "undefined") {
      const ua = window.navigator.userAgent;
      const isIOSDevice = /iPhone|iPad|iPod/.test(ua);
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (navigator as unknown as { standalone?: boolean }).standalone;
      const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|OPiOS|mercury/i.test(ua);

      if (isIOSDevice && !isStandalone && isSafari) {
        setIsIOS(true);
        // Check if user dismissed it in this session
        const dismissedSession = sessionStorage.getItem("kfc_pwa_ios_dismissed");
        if (!dismissedSession) {
          setShowIOSHint(true);
        }
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  // Trigger installation
  const handleInstallClick = async () => {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setCanInstall(false);
        setInstallPrompt(null);
      }
    } catch (err) {
      console.error("[PWA] Install prompt failed:", err);
    }
  };

  // Reload for update
  const handleRefreshUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  };

  const dismissIOSHint = () => {
    setShowIOSHint(false);
    sessionStorage.setItem("kfc_pwa_ios_dismissed", "true");
  };

  return (
    <>
      {/* Update Available Banner */}
      {hasUpdate && (
        <div
          role="alert"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-sm bg-[#FAF7F0] border-2 border-[#E60000] rounded-2xl p-4 shadow-2xl animate-fade-in flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#E60000] animate-spin" />
              <span className="font-bold text-sm text-[#000000]">New Version Available!</span>
            </div>
            <button
              onClick={() => setHasUpdate(false)}
              className="text-[#666666] hover:text-black p-1"
              aria-label="Close update banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#4C3D32]">
            An updated version of the KFC Billing System is ready to use.
          </p>
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={() => setHasUpdate(false)}
              className="px-3 py-1.5 text-xs font-semibold text-[#666666] hover:text-black"
            >
              Later
            </button>
            <button
              onClick={handleRefreshUpdate}
              className="px-4 py-1.5 text-xs font-bold bg-[#E60000] hover:bg-[#cc0000] text-white rounded-lg shadow transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh Now
            </button>
          </div>
        </div>
      )}

      {/* Android & Desktop Install Prompt */}
      {canInstall && !isDismissed && (
        <div
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-40 max-w-sm bg-[#FAF7F0] border border-[#e5e5e5] rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 border border-black/10 shadow-sm shrink-0">
              <img src="/logo.png" alt="KFC Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-bold text-sm text-[#000000] leading-tight">Install KFC App</p>
              <p className="text-[11px] text-[#666666]">Faster access & offline support</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-1.5 text-xs font-bold bg-[#E60000] hover:bg-[#cc0000] text-white rounded-lg shadow-sm transition-all flex items-center gap-1.5 shrink-0"
              id="pwa-install-button"
            >
              <Download className="w-3.5 h-3.5" />
              Install
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="text-[#999999] hover:text-black p-1"
              aria-label="Dismiss install banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari "Add to Home Screen" Hint */}
      {isIOS && showIOSHint && (
        <div
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-40 max-w-sm bg-[#FAF7F0] border border-[#e5e5e5] rounded-2xl p-4 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center p-0.5 border border-black/10 shrink-0">
                <img src="/logo.png" alt="KFC Logo" className="w-full h-full object-contain" />
              </div>
              <p className="font-bold text-xs text-[#000000]">Install Korean Fried Chicken</p>
            </div>
            <button
              onClick={dismissIOSHint}
              className="text-[#999999] hover:text-black p-1"
              aria-label="Dismiss iOS guide"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#4C3D32] leading-relaxed flex items-center flex-wrap gap-1">
            Tap the Share button
            <span className="inline-flex items-center justify-center bg-black/5 px-1.5 py-0.5 rounded text-[#000000] font-semibold text-[11px]">
              <Share className="w-3 h-3 inline mr-0.5" /> Share
            </span>
            in Safari, then select
            <span className="font-bold text-[#E60000]">Add to Home Screen</span>.
          </p>
        </div>
      )}
    </>
  );
}
