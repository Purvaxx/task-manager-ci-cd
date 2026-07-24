# Task Manager API – CI/CD Pipeline

## Overview

This project demonstrates a production-style Continuous Integration and Continuous Deployment (CI/CD) pipeline for a Node.js REST API using GitHub Actions. The pipeline automates testing, Docker image creation, vulnerability scanning, and container registry publishing, following modern DevOps best practices.

---

## Features

- RESTful Task Manager API built with Node.js and Express.js
- Production-style CI/CD pipeline using GitHub Actions
- Automated dependency installation
- Automated test execution
- Docker image build and validation
- Container vulnerability scanning
- Automated image publishing to a container registry
- Production-ready workflow configuration

---

## Technology Stack

- Node.js
- Express.js
- GitHub Actions
- Docker
- Docker Hub / GitHub Container Registry
- npm

---

## Project Structure

```text
.
├── .github/
│   └── workflows/
├── screenshots/
├── src/
├── Dockerfile
├── package.json
└── README.md
```

---

## CI/CD Workflow

The GitHub Actions workflow performs the following steps:

1. Checkout repository
2. Install dependencies
3. Run automated tests
4. Build Docker image
5. Perform vulnerability scan
6. Publish Docker image to the container registry

---

## Local Setup

Clone the repository

```bash
git clone https://github.com/your-username/task-manager-cicd.git
cd task-manager-cicd
```

Install dependencies

```bash
npm install
```

Run the application

```bash
npm start
```

Run in development mode

```bash
npm run dev
```

---

## Docker

Build the Docker image

```bash
docker build -t task-manager-api .
```

Run the Docker container

```bash
docker run -p 3000:3000 task-manager-api
```

---

## Learning Outcomes

- Continuous Integration (CI)
- Continuous Deployment (CD)
- GitHub Actions workflow automation
- Docker containerization
- Container security scanning
- Automated image publishing
- DevOps best practices

---
## CI/CD Pipeline Execution
<img width="1100" height="642" alt="Screenshot" src="https://github.com/user-attachments/assets/18453fab-8e2d-4a3d-b716-43fb5499d7cc" />
