Node.js Zero-Downtime Deployment on Kubernetes

A practical DevOps project demonstrating rolling updates, health checks, and zero-downtime deployments using Kubernetes.
This project features a simple Node.js web application containerized with Docker and deployed to Kubernetes using best-practice deployment strategies.

📌 Project Overview

This project showcases how to achieve zero downtime when deploying new versions of an application using:

Kubernetes Rolling Updates

Readiness & Liveness Probes

Image versioning (v1 → v2)

Automatic rollback

Optional: Blue/Green deployment strategy

The goal is to simulate real-world DevOps deployment patterns used in production.

🚀 Tech Stack
Layer	Technology
Application	Node.js (Express)
Containerization	Docker
Orchestration	Kubernetes
Deployment Strategy	RollingUpdate
Probes	Readiness + Liveness
Environment	Docker Desktop / Minikube
📁 Project Structure
.
├─ Dockerfile
├─ deployment.yaml
├─ README.md
└─ app/
   ├─ index.js
   └─ package.json

🛠️ Features Implemented
✔ Zero-Downtime Deployment

Using RollingUpdate strategy with:

strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0


Meaning:

Kubernetes creates a new pod before stopping an old one.

Users NEVER experience downtime.

✔ Health Checks (Readiness & Liveness)
readinessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 5

livenessProbe:
  httpGet:
    path: /
    port: 3000
  initialDelaySeconds: 10


Ensures:

Traffic is only sent when app is ready.

Stuck pods are auto-restarted.

✔ Automatic Rollbacks

If deployment fails, Kubernetes can revert to the last stable state:

kubectl rollout undo deployment/node-app

📦 Step 1 — Build the Docker Image

Run this inside the project root:

docker build -t node-zero-downtime:v1 .


Test locally:

docker run -p 3000:3000 node-zero-downtime:v1

☸ Step 2 — Deploy to Kubernetes

Apply deployment & service:

kubectl apply -f deployment.yaml


Check rollout:

kubectl rollout status deployment/node-app


You should see:

deployment "node-app" successfully rolled out

🌍 Step 3 — Access the Application

Forward service to localhost:

kubectl port-forward svc/node-app-service 8080:80


Visit:

http://localhost:8080


Expected output:

Hello from Node.js app! Version: v1

🔄 Step 4 — Perform a Rolling Update (v1 → v2)

Edit the app version in index.js:

const version = "v2";


Build the new image:

docker build -t node-zero-downtime:v2 .


Update the image in deployment.yaml:

image: node-zero-downtime:v2


Apply changes:

kubectl apply -f deployment.yaml
kubectl rollout status deployment/node-app


Kubernetes will update pods one at a time without downtime.

⏪ Step 5 — Rollback to Previous Version

If something goes wrong:

kubectl rollout undo deployment/node-app

📊 Deployment Architecture
        ┌──────────────────────────┐
        │        Service           │
        │ node-app-service (80→3000)│
        └─────────────┬────────────┘
                      │
        ┌─────────────┴────────────┐
        │     Kubernetes Deployment │
        │ RollingUpdate Strategy     │
        └─────────────┬────────────┘
                      │
        ┌─────────────┴────────────┐
        │       Pod ReplicaSet      │
        │  v1 → v2 (Updated One-by-One)
        └──────────────────────────┘

