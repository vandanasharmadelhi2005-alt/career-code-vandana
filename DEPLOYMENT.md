# CareerCoded Deployment Guide

This project is ready to deploy as one full-stack Node.js app. The Express server serves both:

- React frontend from `client/dist`
- Backend APIs under `/api`

## Recommended Platform

Use Railway or Render. Railway config is included in `railway.json`.

## Required Production Environment Variables

```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/careercoded_blog
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
ADMIN_NAME=CareerCoded Admin
ADMIN_EMAIL=admin@careercoded.com
ADMIN_PASSWORD=use-a-strong-admin-password
VITE_API_URL=/api
```

## Build Settings

```bash
Build Command: npm install && npm run build
Start Command: npm run deploy:start
```

## Railway Deployment

1. Push the latest code to GitHub.
2. Open Railway and create a new project from the GitHub repo.
3. Select this repository: `vandanasharmadelhi2005-alt/career-code-vandana`.
4. Add these variables in the Railway service:

```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/careercoded_blog
JWT_SECRET=use-a-long-random-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
ADMIN_NAME=CareerCoded Admin
ADMIN_EMAIL=admin@careercoded.com
ADMIN_PASSWORD=use-a-strong-admin-password
VITE_API_URL=/api
```

If you attach Railway's MongoDB plugin, Railway may create `MONGO_URL` or `DATABASE_URL` instead. The backend now supports `MONGO_URI`, `MONGO_URL`, and `DATABASE_URL`.

5. Deploy. After deployment, open the Railway shell and seed admin:

```bash
npm run seed:admin --prefix server
```

## After First Deploy

Open the hosting platform shell and seed the admin account:

```bash
npm run seed:admin --prefix server
```

## Health Check

```bash
/api/health
```

Expected response:

```json
{
  "message": "CareerCoded Blog API is running."
}
```

## Local Final Check

The local final version is available at:

```bash
http://127.0.0.1:5000
```
