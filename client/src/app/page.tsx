"use client";

import Badge from "@/components/Badge";
import Chat from "@/components/Chat";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "dotlottie-player": React.DetailedHTMLProps<any, any>;
    }
  }
}

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-screen-xl flex-col items-center justify-between lg:px-24 mx-auto">
      <div className="lg:grid lg:grid-cols-2 w-full">
        <div className="bg-gray-200 dark:bg-slate-800 font-sans h-[400px] lg:h-screen w-full flex flex-row justify-center items-center">
          <Badge />
        </div>
        <div className="h-[calc(100dvh-400px)] lg:h-screen">
          <Chat />
        </div>
      </div>
    </main>
  );
}
