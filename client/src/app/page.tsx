"use client";

import Chat from "@/components/Chat";
import { DotLottiePlayer } from "@dotlottie/react-player";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between lg:px-24">
      <div className="grid grid-cols-2">
        <div className="bg-gray-200 font-sans h-screen w-full flex flex-row justify-center items-center">
          <div className="card w-96 mx-auto bg-white  shadow-xl hover:shadow px-2">
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
                Front end Developer, avid reader. Love to take a long walk,
                sawim
              </p>
            </div>
            <hr className="mt-8" />
            <div className="flex p-4">
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
        <div>
          <Chat />
        </div>
      </div>
    </main>
  );
}
