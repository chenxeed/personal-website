"use client";
import { PostHogProvider } from "posthog-js/react";
import { FunctionComponent, PropsWithChildren, useEffect } from "react";
import { init } from "@/service/analytics";

export const AnalyticsProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  useEffect(() => {
    init();
  }, []);

  return <PostHogProvider>{children}</PostHogProvider>;
};
