# KinlayGyeltshen_02240347_DSO_A1

## DSO101 Assignment 1 - CI/CD To-Do App

This repository contains a Dockerized full-stack To-Do application and deployment artifacts for Assignment 1.

## Project Structure

```text
A1/
  todo-app/
    backend/
      Dockerfile
      .env.production
    frontend/
      Dockerfile
      .env.production
    render.yaml
```

## Step 0 - Local Application

- Backend: Node.js + Express + Prisma (SQLite)
- Frontend: React
- Features implemented:
  - Add task
  - Edit task
  - Mark task complete/pending
  - Delete task

### Local Environment Variables

Create these files locally (do not commit `.env`):

- `A1/todo-app/backend/.env`
  - `PORT=5000`
- `A1/todo-app/frontend/.env`
  - `REACT_APP_API_URL=http://localhost:5000`

### Local Run Commands

Backend:

```bash
cd A1/todo-app/backend
npm install
node server.js
```

Frontend:

```bash
cd A1/todo-app/frontend
npm install
npm start
```

## Part A - Build and Push Docker Images

Use your student ID (`02240347`) as the image tag.

Backend:

```bash
cd A1/todo-app/backend
docker build -t <your-dockerhub-username>/be-todo:02240347 .
docker push <your-dockerhub-username>/be-todo:02240347
```

Frontend:

```bash
cd A1/todo-app/frontend
docker build -t <your-dockerhub-username>/fe-todo:02240347 .
docker push <your-dockerhub-username>/fe-todo:02240347
```

### Render Deployment (Pre-built Images)

- Create backend web service from existing Docker Hub image.
- Add environment variables:
  - `PORT=5000`
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD` (as required by your DB setup)
- Create frontend web service from existing Docker Hub image.
- Set `REACT_APP_API_URL` to backend live URL.

## Part B - Automated Build and Deployment from Git

Blueprint file is provided at:

- `A1/todo-app/render.yaml`

This allows Render to build/deploy backend and frontend Docker services directly from repository commits.

## Screenshots to Attach for Submission

Add the following screenshots to this README before submission:

1. Local app running (frontend + backend)
2. Docker images built locally
3. Docker Hub repositories with pushed tags (`02240347`)
4. Render backend service configuration and successful deploy
5. Render frontend service configuration and successful deploy
6. Render Blueprint (`render.yaml`) deployment output

## Notes

- `.env` files are ignored via `.gitignore`.
- `.env.production` templates are included for deployment configuration.
