# Sakinah Chat API

A tiny Vercel serverless function at `/api/ai-chat` that talks to OpenAI's Responses API.

## Deploy
1) Create a new GitHub repo and upload this folder.
2) Import the repo on Vercel and deploy.
3) In Vercel Project Settings → Environment Variables, add `OPENAI_API_KEY` and optionally `OPENAI_MODEL`.
4) Your endpoint will be `https://<project>.vercel.app/api/ai-chat`.
