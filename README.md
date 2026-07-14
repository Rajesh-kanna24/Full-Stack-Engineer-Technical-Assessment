# AI-Ready Job Portal

A production-ready SaaS application with an AI Resume Matching API, Automated Job Aggregation Scraper, and comprehensive Dashboards.

## Features
- **Authentication**: JWT Auth, Refresh Tokens, RBAC (Admin, Employer, Candidate).
- **Core Jobs API**: Full CRUD, Search, Filter, Pagination.
- **AI Resume Matching**: Endpoints designed to compare resumes vs job descriptions.
- **Automated Job Scraper**: Built with Node-cron to aggregate jobs automatically from public APIs.
- **Dashboards**: Fully functional Next.js 15 UI with modern SaaS design and Tailwind CSS.
- **Containerization**: Docker Compose setup for Backend, Frontend, Postgres, and Redis.
- **CI/CD & Testing**: GitHub Actions workflow and Jest Unit Tests.
- **API Documentation**: Integrated Swagger/OpenAPI and a Postman collection.

## Tech Stack
**Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, Shadcn UI, React Query, Zod.
**Backend**: Node.js, Express, TypeScript, Prisma, PostgreSQL, Redis.

## Setup Instructions

This project is built for zero-friction setup.

1. **Clone the repository**
   ```bash
   git clone <repo>
   cd job-portal
   ```

2. **Copy Environment Variables**
   ```bash
   cp .env.example .env
   ```

3. **Start the Database Services**
   ```bash
   docker-compose up -d postgres redis
   ```

4. **Install Dependencies & Run Backend**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma migrate dev
   npm run dev
   ```

5. **Install Dependencies & Run Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

### Running with full Docker Setup
You can also run the entire stack (Frontend + Backend + DB) via Docker:
```bash
docker-compose up -d
```

## API Documentation
Once the backend is running, access the Swagger documentation at:
`http://localhost:5000/api-docs`

A Postman collection `job-portal-collection.json` is also available in the root directory.

## Testing
To run the backend Jest unit tests:
```bash
cd backend
npm test
```
