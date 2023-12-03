"use client";

import Image from "next/image";
import React, {
  FormEvent,
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./chat.module.css";

interface ChatProps {
  message: string;
}

const USER_CHAT_LIMIT = 5;

const ChatAI: FunctionComponent<ChatProps> = ({ message }) => {
  return (
    <div className="chat-message">
      <div className="flex items-end">
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 dark:bg-slate-700 text-gray-600 dark:text-slate-100">
              {message}
            </span>
          </div>
        </div>
        <Image
          width={40}
          height={40}
          src="/albert-3d-avatar.png"
          alt="My profile"
          className="w-6 h-6 rounded-full order-1"
        />
      </div>
    </div>
  );
};

const ChatHuman: FunctionComponent<ChatProps> = ({ message }) => {
  return (
    <div className="chat-message">
      <div className="flex items-end justify-end">
        <div className="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end">
          <div>
            <span className="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 dark:bg-blue-200 text-white dark:text-black">
              {message}
            </span>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          fill="currentColor"
          className="w-6 h-6 rounded-full order-2"
          viewBox="0 0 16 16"
        >
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
          <path
            fillRule="evenodd"
            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
          />
        </svg>
      </div>
    </div>
  );
};

export const Chat = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [chats, setChats] = useState<
    { author: "ai" | "user"; message: string }[]
  >([]);
  const messageContainer = useRef<HTMLDivElement>(null);
  const userChatCount = useMemo(
    () => chats.filter(({ author }) => author === "user").length,
    [chats]
  );
  const limitReached = useMemo(
    () => userChatCount >= USER_CHAT_LIMIT && !isLoading,
    [userChatCount, isLoading]
  );

  useEffect(() => {
    const el = document.getElementById("messages");
    if (el) {
      el.scrollTop = el.scrollHeight;
    }

    // After a short delay, show an automated message from AlbertAI
    setIsLoading(true);
    setTimeout(() => {
      setChats([
        {
          author: "ai",
          message:
            "Hi, I'm Albert! I'm here to virtually assist your questions about me. What do you want to ask?",
        },
      ]);
      setIsLoading(false);
    }, 2000);
  }, []);

  // Scroll to bottom when new message is added
  useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
  }, [chats, isLoading, isFailed]);

  const onSubmitMessage = (e: FormEvent) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    const formData = e.target as HTMLFormElement & {
      message: { value: string };
    };
    const message = formData["message"].value;

    setChats([...chats, { author: "user", message }]);
    setIsLoading(true);
    setIsFailed(false);

    formData.reset();

    if (!conversationId) {
      fetch("/api/v1/conversations", {
        method: "POST",
        body: JSON.stringify({
          message,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setConversationId(res.conversation._id);
          setChats((chats) => [
            ...chats,
            { author: "ai", message: res.aiReply },
          ]);
          setIsLoading(false);
        })
        .catch(() => {
          setIsFailed(true);
          setIsLoading(false);
        });
    } else {
      fetch(`/api/v1/conversations/${conversationId}`, {
        method: "PATCH",
        body: JSON.stringify({
          message,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setChats((chats) => [
            ...chats,
            { author: "ai", message: res.aiReply },
          ]);
          setIsLoading(false);
        })
        .catch(() => {
          setIsFailed(true);
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="flex-1 p:2 sm:p-6 justify-between flex flex-col h-full dark:bg-gray-900">
      <div className="hidden lg:flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <span className="absolute text-green-500 right-0 bottom-0">
              <svg width="20" height="20">
                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
              </svg>
            </span>
            <Image
              width={40}
              height={40}
              src="/albert-3d-avatar.png"
              alt=""
              className="w-10 sm:w-16 h-10 sm:h-16 rounded-full"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="text-2xl mt-1 flex items-center">
              <span className="mr-3">Albert Shintra</span>
            </div>
            <span className="text-lg ">Software Engineer</span>
          </div>
        </div>
      </div>
      <div
        ref={messageContainer}
        id="messages"
        className={`flex flex-col space-y-4 p-3 h-full overflow-y-auto ${styles["scrollbar-thumb-blue"]} ${styles["scrollbar-thumb-rounded"]} ${styles["scrollbar-track-blue-lighter"]} ${styles["scrollbar-w-2"]} scrolling-touch`}
      >
        {chats.map((chat, index) => {
          return chat.author === "ai" ? (
            <ChatAI key={index} message={chat.message} />
          ) : (
            <ChatHuman key={index} message={chat.message} />
          );
        })}
        {isLoading && <ChatAI message="..." />}
        {limitReached && (
          <ChatAI
            message={`Thank you for talking with me! You have reached the maximum quota of ${USER_CHAT_LIMIT} chats. I hope to see you again!`}
          />
        )}
        {isFailed && (
          <ChatAI
            message={`Sorry, I'm having trouble connecting to the server. Please try again later!`}
          />
        )}
      </div>
      <div className="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
        <form className="flex" onSubmit={onSubmitMessage}>
          <input
            type="text"
            name="message"
            placeholder="Write your message!"
            maxLength={100}
            className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-2 bg-gray-200 rounded-md py-3 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLoading || limitReached}
          />
          <div className="items-center inset-y-0">
            <button
              type="submit"
              disabled={isLoading || limitReached}
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 ml-2 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="hidden lg:inline font-bold">Send</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-6 w-6 ml-2 transform rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
