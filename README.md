# HirePilot X — AI Interview Practice Platform

A full-stack AI-powered mock interview platform for students.
Built with React + Vite + TailwindCSS + Node.js + Express + MongoDB + Firebase + Gemini AI.
 Live Demo : https://hirepilot-x.vercel.app

## 📁 Project Structure

```
version 1/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Navbar, ScoreCard, InterviewCard, etc.
│   │   ├── context/            # Firebase Auth context
│   │   ├── pages/              # Login, Signup, Dashboard, Profile, Interview, Report
│   │   ├── services/           # Axios API service with token auto-attach
│   │   └── firebase.js         # Firebase init
│   └── .env                    # ⚠️ Fill in Firebase web config
│
└── server/                     # Node.js + Express backend
    ├── config/                 # MongoDB + Firebase Admin
    ├── controllers/            # User + Interview controllers
    ├── middleware/             # Auth + Error handler
    ├── models/                 # User + Interview Mongoose models
    ├── routes/                 # API routes
    ├── services/               # Gemini AI service
    └── .env                    # Already filled in
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/profile` | Get/create user profile |
| PUT | `/api/users/profile` | Update profile |
| GET | `/api/users/dashboard` | Stats + recent interviews |
| POST | `/api/interviews/start` | Generate 5 AI questions |
| POST | `/api/interviews/:id/submit` | Submit answers + get AI evaluation |
| GET | `/api/interviews/history` | All completed interviews |
| GET | `/api/interviews/:id` | Single interview report |
| GET | `/api/health` | Health check |

---

## 🎨 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS v3, Framer Motion, Lucide React
- **Backend**: Node.js, Express, Mongoose, Firebase Admin SDK
- **Database**: MongoDB Atlas
- **Auth**: Firebase (Google + Email/Password)
- **AI**: Google Gemini 1.5 Flash API
