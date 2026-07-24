# Task Manager API — CI/CD Pipeline Demo

![CI/CD](https://github.com/YOUR_USERNAME/task-manager-cicd/actions/workflows/ci-cd.yml/badge.svg)
![CodeQL](https://github.com/YOUR_USERNAME/task-manager-cicd/actions/workflows/codeql.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A small REST API (Node.js/Express) built to showcase a **production-style CI/CD pipeline** on GitHub Actions — linting, automated tests across multiple Node versions, Docker image build, vulnerability scanning, static security analysis, and publishing to GitHub Container Registry (GHCR).

The app itself is intentionally simple (in-memory CRUD API) so the pipeline is the star of the project.

## Architecture

```
                ┌────────────┐
   push / PR →  │   GitHub   │
                │  Actions   │
                └─────┬──────┘
                       │
        ┌──────────────┼───────────────┐
        ▼               ▼               ▼
     ┌──────┐       ┌────────┐     ┌─────────┐
     │ Lint │──────▶│  Test  │────▶│  Build  │
     │ESLint│       │Jest x2 │     │ Docker  │
     └──────┘       │(Node18,│     └────┬────┘
                     │  20)   │          │
                     └────────┘          ▼
                                    ┌───────────┐
                                    │Trivy scan │
                                    │ (CRITICAL/│
                                    │   HIGH)   │
                                    └─────┬─────┘
                                          │ (main branch only)
                                          ▼
                                   ┌─────────────┐
                                   │  Push image │
                                   │  to GHCR    │
                                   └─────────────┘

  (parallel) CodeQL SAST scan runs on every push/PR + weekly schedule
```

## Pipeline stages

| Stage | Tool | What it catches |
|---|---|---|
| Lint | ESLint | Style issues, likely bugs, unused vars |
| Test | Jest + Supertest, matrix on Node 18 & 20 | Broken CRUD logic, regressions, cross-version compatibility |
| Coverage | Jest `--coverage`, uploaded as build artifact | Untested code paths |
| Build | Docker (multi-stage, non-root user) | Broken Dockerfile / missing deps |
| Image scan | Trivy | Known CVEs in the base image and dependencies |
| SAST | CodeQL | Security-relevant code patterns (injection, etc.) |
| Publish | `docker push` to `ghcr.io` | Only runs on merge to `main`, tagged with commit SHA + `latest` |

Pull requests run everything except the final publish step, so a bad PR fails fast before anything is ever pushed to the registry.

## Tech stack

- **App**: Node.js, Express
- **Tests**: Jest, Supertest
- **Lint**: ESLint
- **Containerization**: Docker (multi-stage build, non-root user, `HEALTHCHECK`)
- **CI/CD**: GitHub Actions
- **Security**: Trivy (container vuln scan), CodeQL (SAST)
- **Registry**: GitHub Container Registry (GHCR)

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check |
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create a task (`{ "title": "string", "done": false }`) |
| GET | `/tasks/:id` | Get a single task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Running locally

```bash
npm install
npm run dev          # starts on http://localhost:3000

npm test              # run the test suite
npm run lint           # run ESLint
```

## Running with Docker

```bash
docker build -t task-manager-api .
docker run -p 3000:3000 task-manager-api
curl http://localhost:3000/health
```

## Setting this up on your own GitHub account

1. Push this repo to GitHub (see steps below).
2. Go to **Settings → Actions → General → Workflow permissions** and make sure "Read and write permissions" is enabled — this lets the pipeline push images to GHCR using the built-in `GITHUB_TOKEN` (no extra secrets needed).
3. Push to `main` and watch the **Actions** tab. After a successful run, your image will be at `ghcr.io/<your-username>/task-manager-cicd:latest`.
4. Replace `YOUR_USERNAME` in the badge URLs at the top of this README with your actual GitHub username.

```bash
git init
git add .
git commit -m "Initial commit: task manager API with full CI/CD pipeline"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/task-manager-cicd.git
git push -u origin main
```

## Why this project (notes for reviewers / interviewers)

This is deliberately a *small* app wrapped in a *complete* pipeline, to demonstrate:
- Writing testable code (app/server split so Express app can be tested without binding a port)
- A realistic branch protection setup (PRs run lint+test+scan, only `main` publishes)
- Multi-stage, non-root Docker builds
- Supply-chain awareness (image vulnerability scanning + SAST, not just "tests pass")
- Using free, zero-config infrastructure (GHCR + `GITHUB_TOKEN`) so the whole thing runs with no cloud account or paid secrets

## Resume bullet points (edit to taste)

- Designed and built a CI/CD pipeline in GitHub Actions (lint → matrix test → Docker build → vulnerability scan → publish) for a Node.js/Express REST API, reducing manual release steps to zero.
- Implemented automated testing (Jest/Supertest, 90%+ coverage) and static analysis (ESLint, CodeQL) as required checks on every pull request.
- Containerized the application with a multi-stage, non-root Dockerfile and integrated Trivy vulnerability scanning into the build pipeline.
- Published versioned Docker images to GitHub Container Registry, tagged by commit SHA for full build traceability.

## License

MIT
