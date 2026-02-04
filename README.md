# StudyFlow

StudyFlow is a full-stack task management web application built to help students organize and track their study tasks.

## Features
- Email & password authentication
- Create, read, update, and delete (CRUD) tasks
- Each user sees only their own tasks (secure row-level access)
- Persistent data with PostgreSQL
- Clean, responsive UI

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript
- **Backend:** Supabase (Auth + Postgres)
- **Styling:** CSS / utility classes
- **Deployment:** Vercel

## Live Demo
https://studyflow-cyan.vercel.app/

## How it Works
- Users sign up or log in using Supabase Authentication
- Tasks are stored in a Supabase Postgres database
- Row Level Security ensures users can only access their own data
- The dashboard allows users to add, complete, and delete tasks in real time

## Setup (Local)
```bash
npm install
npm run dev
