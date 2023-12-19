# ChenXeed Personal Website

[chenxeed.my.id](https://chenxeed.my.id)

Tech Stack: NextJS, NestJS, MongoDB, ChromaDB, gRPC, OpenAI API, Langchain

A showcase application that showcases the AI Avatar persona, with the power of LLM and the Retrieval Augmented Generation method

## The Chat Flow

![image](https://github.com/chenxeed/personal-website/assets/3530355/bbcdaf2a-35e1-440c-8477-929fb4ee26ef)

## Get Started

This application makes use of `docker-compose` in the local environment. If you have Docker installed, you may just run `docker compose up -d` to start the application.

Before you start the application, there are compulsory `.env` files needed to setup, which is:

```
// backend/.env
OPENAI_API_KEY={youropenaikeyhere}
EMBEDDER_ENDPOINT=embedder:50051
EMBEDDER_TYPE=mini-lm-l6-v2
CHROMA_ENDPOINT=http://chroma:8000
JWT_SECRET={yourjwtsecret}
ADMIN_SECRET={yourpasswordtoadminpage}
```

There are few more `.env` variables to setup like posthog and sentry but they are not necessary if you're not using it.
