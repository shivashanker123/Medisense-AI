# MediSense AI

MediSense AI is an AI-assisted health diagnostics platform built to make report interpretation more accessible, structured, and fast. The project brings multiple screening workflows into one interface so users can upload clinical data, lab reports, ECG images, and scans to receive model-driven analysis for kidney, heart, blood, lung, and brain-related conditions.

## Project Abstract

Healthcare data is often difficult for non-specialists to interpret quickly, especially when results come from different report formats and imaging workflows. MediSense AI addresses that gap by combining machine learning, computer vision, OCR-assisted extraction, and a guided frontend experience into one system. The platform helps users move from raw inputs to organized clinical insights through module-specific workflows for urinalysis, ECG analysis, CBC interpretation, lung screening, and brain MRI review.

The goal of the project is not to replace clinical experts, but to support early screening, improve accessibility, and reduce friction in understanding medical reports. By combining authentication, profile-based personalization, and AI-backed analysis flows, MediSense AI creates a single dashboard for multi-domain diagnostic assistance.

## Health Modules

- Kidney and liver report analysis
- Heart ECG image analysis
- CBC and blood picture interpretation
- Lung screening workflow
- Brain MRI workflow

## Core Features

- Dynamic landing page with rotating diagnostics visuals and animated messaging
- Supabase authentication for login, signup, and session handling
- Profile capture for patient name, age, and gender
- Protected health-module routes
- Saved-profile autofill for supported workflows
- OCR-assisted report upload for kidney and CBC modules
- FastAPI backend integration for AI inference

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: FastAPI, Python, machine learning models
- Database/Auth: Supabase
- Networking: Axios

## How The System Works

1. Users land on the home page and explore the available health modules.
2. Opening a protected module prompts login if the user is not authenticated.
3. On first protected access, the app collects basic patient details and stores them in Supabase.
4. Supported modules reuse the saved profile and reduce repeated data entry.
5. Users upload medical reports or images, and the backend returns structured AI analysis.

## Project Structure

```text
medisense-frontend/
├─ public/
├─ src/
│  ├─ components/
│  ├─ contexts/
│  ├─ lib/
│  └─ pages/
├─ supabase/
└─ README.md
```

## Setup

### Frontend

```bash
npm install
npm run dev
```

### Backend

Run the FastAPI backend from the project backend folder so the frontend can reach the inference endpoints.

### Supabase

1. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the frontend `.env`.
2. Enable Email/Password authentication in Supabase.
3. Run the SQL in `supabase/profiles.sql` to create the `profiles` table and row-level policies.

## Authentication Flow

- Login and signup are handled with Supabase Auth.
- After authentication, users return to the homepage first.
- When they open a protected health module for the first time, they complete a short profile form.
- That profile is stored in Supabase and reused in the diagnostic flows.

## Disclaimer

MediSense AI is a student-built healthcare support project for screening and educational use. It does not replace licensed medical advice, diagnosis, or treatment. Clinical decisions should always be confirmed by qualified healthcare professionals.
