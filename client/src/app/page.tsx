"use client";

import Chat from "@/components/Chat";
import { DotLottiePlayer } from "@dotlottie/react-player";

export default function Home() {
  return (
    <main className="flex min-h-screen max-w-screen-xl flex-col items-center justify-between lg:px-24 mx-auto">
      <div className="lg:grid lg:grid-cols-2 w-full">
        <div className="bg-gray-200 font-sans h-[400px] lg:h-screen w-full flex flex-row justify-center items-center">
          <div className="card w-full lg:w-96 mx-auto mt-[70px] lg:px-2 bg-white shadow-xl hover:shadow">
            <div className="w-32 h-32 mx-auto -mt-20">
              <DotLottiePlayer
                autoplay
                loop
                src="/devcoding.lottie"
                className="rounded-full border-8 border-white"
              />
            </div>
            <div className="text-center mt-2 text-3xl font-medium">
              Albert Mulia Shintra
            </div>
            <div className="text-center mt-2 font-light text-sm">@chenxeed</div>
            <div className="text-center font-normal text-lg">Indonesia</div>
            <div className="px-6 text-center mt-2 font-light text-sm">
              <p>
                <span className="font-semibold">Software Engineer</span>
              </p>
              <p>Loves to build, craft, and experiment web technologies.</p>
            </div>
            <hr className="mt-8" />
            <div className="flex justify-center p-4">
              <div className="w-1/2 text-center">
                <a
                  href="https://github.com/chenxeed"
                  target="_blank"
                  rel="noreferrer"
                >
                  Github
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="h-[calc(100vh-400px)] lg:h-screen">
          <Chat />
        </div>
      </div>
    </main>
  );
}
