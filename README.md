# AI Job Portal - Full Stack Technical Assessment

A Next Generation Job Portal connecting Employers and Candidates, featuring modern job aggregation, role-based dashboards, and AI-ready endpoints.

## 🚀 Features Implemented
* **Module 1 (Auth):** JWT-based Auth, Refresh Tokens, Role-Based Access Control (Admin, Employer, Candidate).
* **Module 2 (Job Portal):** CRUD operations for Jobs. Candidate job filtering, searching, and application tracking.
* **Module 3 (REST APIs):** Fully built Express.js backend with strict Zod validations. 
* **Module 4 (Database):** Relational schema via PostgreSQL and Prisma ORM.
* **Module 5 & 6 (Scraper):** Automated API job scraping (Remotive API) via Node-Cron (Runs every 6 hours).
* **Module 7 (Dashboard):** Rich analytics dashboard for Admins and metrics for Employers/Candidates.
* **Module 8 (Frontend):** Responsive Next.js 15 UI with Tailwind CSS and Shadcn UI.
* **Bonus Features Built:**
  - **Swagger/OpenAPI** (`/api-docs` endpoint)
  - **Docker** (`docker-compose.yml` included)
  - **Rate Limiting** (Configured via `express-rate-limit`)
  - **AI Resume API** (Mocked endpoint at `/api/v1/ai/match-resume`)

## 🛠️ Tech Stack
* **Frontend:** Next.js (App Router), React, Tailwind CSS, Axios, React Query
* **Backend:** Node.js, Express.js, TypeScript
* **Database:** PostgreSQL, Prisma ORM

## ⚙️ Local Setup Instructions

**1. Clone the repository and install dependencies**
```bash
git clone <repository-url>
cd <project-folder>
npm install