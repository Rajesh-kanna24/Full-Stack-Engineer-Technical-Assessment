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
```
### cd Full-Stack-Engineer-Technical-Assessment
### 2. Backend Setup
```Bash
cd backend
npm install

```
### Create a .env file inside the backend folder
```bash
Code snippet
DATABASE_URL="postgresql://postgres:password@localhost:5432/jobportal?schema=public"
JWT_SECRET="super_secret_jwt_key_123!"
JWT_REFRESH_SECRET="super_secret_refresh_key_456!"
PORT=5000
```
### Run database migrations and start the server:


```Bash
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
### 3. Frontend Setup Open a new terminal window:

```Bash
cd frontend
npm install
Create a .env.local file inside the frontend folder:
```
### Code snippet
```
NEXT_PUBLIC_API_URL="http://localhost:5000/api/v1"
```
### Start the frontend server:
```Bash
npm run dev
The application will be available at http://localhost:3000.
````
Running with Docker (Alternative) Ensure Docker is running, then from the root directory:

Bash
docker-compose up --build
📄 API & Deliverables
Postman Collection: A complete collection is available in the root folder as job-portal-collection.json. You can import this directly into Postman.

API Documentation: Once the backend is running, visit http://localhost:5000/api-docs for the Swagger UI.


---

### 3. Database Schema Document (`DATABASE_SCHEMA.md`)
*(Optional but highly recommended: Add this file to your repository root to impress the reviewers with your database design skills).*

```markdown
# Database Schema Design

The application uses a PostgreSQL relational database managed by Prisma ORM. Below is an overview of the core entities and their relationships.

### Core Tables

1. **User**
   * `id` (String, UUID, Primary Key)
   * `name` (String)
   * `email` (String, Unique)
   * `password` (String, Hashed)
   * `role` (Enum: ADMIN, EMPLOYER, CANDIDATE)
   * *Relationships:* One-to-Many with `Job` (as employer), One-to-Many with `Application` (as applicant).

2. **Job**
   * `id` (String, UUID, Primary Key)
   * `employerId` (String, Foreign Key referencing User)
   * `title`, `companyName`, `location` (String)
   * `workMode` (Enum: REMOTE, HYBRID, ONSITE)
   * `employmentType` (Enum: FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP)
   * `salary`, `experience`, `description` (String)
   * `skills` (String Array)
   * `status` (Enum: OPEN, CLOSED)
   * *Relationships:* One-to-Many with `Application`.

3. **Application**
   * `id` (String, UUID, Primary Key)
   * `jobId` (String, Foreign Key referencing Job)
   * `candidateId` (String, Foreign Key referencing User)
   * `status` (Enum: PENDING, REVIEWED, ACCEPTED, REJECTED)
   * `resumeUrl` (String, Optional)
   * *Relationships:* Belongs to `Job`, Belongs to `User`.

4. **ScrapedJob**
   * `id` (String, UUID, Primary Key)
   * `source` (String - e.g., 'Remotive API')
   * `url` (String, Unique)
   * `title`, `company`, `location`, `description` (String)
   * `skills` (String Array)
   * `postedDate` (DateTime)

### Indexing & Constraints
* **Unique Constraints:** Applied to `User.email` and `ScrapedJob.url` to prevent duplicate accounts and duplicate scraped jobs.
* **Foreign Key Constraints:** Ensure referential integrity (e.g., an application canno