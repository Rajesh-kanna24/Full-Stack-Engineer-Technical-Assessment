# AI-Ready Job Portal - Full Stack Technical Assessment

A modern, scalable Job Portal connecting Employers and Candidates, featuring automated job aggregation, role-based dashboards, and RESTful APIs. Built for the Innov2Grow Technical Assessment.

## 🚀 Live Demo
* **Frontend:** [Insert Live Frontend URL Here]
* **Backend API Base URL:** [Insert Live Backend URL Here]
* **Swagger API Docs:** `[Insert Live Backend URL Here]/api-docs`

## 🛠️ Technology Stack
* **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, TypeScript, Axios, React Query
* **Backend:** Node.js, Express.js, TypeScript, Zod (Validation)
* **Database:** PostgreSQL, Prisma ORM
* **Deployment:** Vercel (Frontend), Render (Backend & DB)

## ✨ Modules & Features Implemented

* **Module 1 (Auth):** Secure JWT authentication, Refresh Tokens, Role-Based Access Control (Admin, Employer, Candidate).
* **Module 2 (Job Portal):** Complete CRUD for Employers. Search, filter, and apply functionalities for Candidates.
* **Module 3 (REST APIs):** Fully documented Express.js REST APIs with robust error handling and pagination.
* **Module 4 (Database):** Relational schema via PostgreSQL and Prisma (Users, Jobs, Applications, ScrapedJobs).
* **Module 5 & 6 (Scraper):** Automated API job scraping fetching remote jobs via the Remotive public API. Includes a scheduled cron job (every 6 hours) and a manual trigger endpoint.
* **Module 7 (Dashboard):** Analytics and metrics display for Admins, Employers, and Candidates.
* **Module 8 (Frontend):** Fully responsive, accessible UI built with Tailwind CSS and Shadcn components.

### 🌟 Bonus Features Completed
* [x] **Docker:** Included `docker-compose.yml` for isolated containerized environments.
* [x] **Swagger/OpenAPI:** Auto-generated interactive API docs available at `/api-docs`.
* [x] **Unit Tests:** Jest configuration for critical backend services.
* [x] **CI/CD:** GitHub Actions workflow (`.github/workflows/ci.yml`) for automated testing.
* [x] **Rate Limiting:** Global API rate limiting to prevent abuse.

## ⚙️ Local Development Setup

### Prerequisites
* Node.js (v18+)
* PostgreSQL (or Docker Desktop)

### 1. Clone the repository
```bash
git clone [https://github.com/YourUsername/Full-Stack-Engineer-Technical-Assessment.git](https://github.com/YourUsername/Full-Stack-Engineer-Technical-Assessment.git)
cd Full-Stack-Engineer-Technical-Assessment
```

### 2. Backend Setup
```bash
cd backend
npm install

```
### Run database migrations and start the server:
``` bash 
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
### 3. Frontend Setup
``` bash
cd frontend
npm install
```

### to run the servers
``` bash
npm run dev
```