import posthog from "posthog-js";
import { usePostHog } from "posthog-js/react";

export function init(): void {
  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: "https://app.posthog.com",
    });
  }
}

interface UseLogHook {
  log: (eventName: string, value: unknown) => void;
}
export function useLog(): UseLogHook {
  const posthog = usePostHog();

  return {
    log: (eventName: string, value: unknown) =>
      posthog.capture(eventName, { property: value }),
  };
}
