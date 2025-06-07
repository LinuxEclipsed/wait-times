# Waiting Room Management System

A modern waiting room management system with React frontend, FastAPI backend, and MariaDB database.


## Features

   - Real-time provider status board

   - Admin panel for managing providers

   - Configurable wait time display

   - Responsive design for all devices

   - Persistent data storage

## Technology Stack

   - Frontend: React.js with Material-UI

   - Backend: Python FastAPI

   - Database: MariaDB

   - Containerization: Docker/Podman

   - Orchestration: Kubernetes

## Prerequisites

    Docker 20.10+

    Node.js 16+

    Python 3.9+

    MariaDB 10.6+ (or MySQL 8.0+)

# Quick Start
## Development Setup

Clone the repository

```bash
git clone https://github.com/your-repo/waiting-room-system.git
cd waiting-room-system
```

Set up backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/MacOS
# venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

Set up frontend

```bash
cd ../frontend
npm install
```

Configure environment variables
Create .env files in both backend and frontend directories with your configuration.

Run the system

```bash
# In one terminal (backend)
cd backend && uvicorn main:app --reload

# In another terminal (frontend)
cd frontend && npm start
```

Docker Deployment
Using Docker Compose

    Build and run containers

```bash
docker-compose up -d --build
```

Access the application

   - Frontend: http://localhost:3000

   - Backend API: http://localhost:8000

   - API Docs: http://localhost:8000/docs

Stop containers

```bash
docker-compose down
```