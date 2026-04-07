# AgroVision — Crop Disease Detection System

A modern full-stack web application for detecting crop diseases from leaf images using image analysis.

## Tech Stack
- **Frontend:** React + Vite, Framer Motion, Lucide Icons
- **Backend:** Python FastAPI, SQLAlchemy, SQLite, Pillow, bcrypt

## Setup

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```
Backend runs on `http://localhost:8001`

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`

## Features
- User Registration & Login with secure password hashing
- Forgot Password / Reset Password flow
- Upload crop leaf images for disease detection
- Supports 38 PlantVillage disease classes
- Scan history tracking per user
- Treatment recommendations for detected diseases
- Beautiful, responsive UI with animations
