import Script from "next/script";

export const Badge = () => {
  return (
    <div className="card w-full lg:w-96 mx-auto mt-[70px] lg:px-2 bg-slate-100 dark:bg-gray-800 shadow-xl hover:shadow">
      <div className="w-32 h-32 mx-auto -mt-20">
        <Script
          type="module"
          src="https://unpkg.com/@dotlottie/player-component@2.3.0/dist/dotlottie-player.mjs"
        ></Script>
        <dotlottie-player
          autoplay
          loop
          src="/devcoding.lottie"
          className="rounded-full border-8 border-white dark:border-black"
        />
      </div>
      <div className="text-center mt-2 text-3xl font-medium">
        Albert Mulia Shintra
      </div>
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
        <div className="w-1/2 text-center">
          <a
            href="https://linkedin.com/in/albertchenx"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
};
