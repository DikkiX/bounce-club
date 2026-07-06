"use client";

import { useEffect } from "react";

/**
 * Suppresses unhandled rejections from browser extensions (MetaMask, etc.)
 * so they don't trigger the Next.js dev error overlay.
 */
export function ExtensionErrorGuard() {
  useEffect(() => {
    function isExtensionError(reason: unknown): boolean {
      const msg = String(
        reason instanceof Error ? reason.message : reason ?? "",
      ).toLowerCase();
      const stack = reason instanceof Error ? reason.stack ?? "" : "";
      return (
        msg.includes("metamask") ||
        msg.includes("chrome-extension") ||
        stack.includes("chrome-extension://") ||
        stack.includes("moz-extension://")
      );
    }

    function onRejection(event: PromiseRejectionEvent) {
      if (isExtensionError(event.reason)) {
        event.preventDefault();
      }
    }

    function onError(event: ErrorEvent) {
      const src = event.filename ?? "";
      if (
        src.includes("chrome-extension://") ||
        src.includes("moz-extension://") ||
        String(event.message).toLowerCase().includes("metamask")
      ) {
        event.preventDefault();
      }
    }

    window.addEventListener("unhandledrejection", onRejection);
    window.addEventListener("error", onError);
    return () => {
      window.removeEventListener("unhandledrejection", onRejection);
      window.removeEventListener("error", onError);
    };
  }, []);

  return null;
}
