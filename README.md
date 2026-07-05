# HirePilot X — AI Interview Practice Platform

A full-stack AI-powered mock interview platform for students.
Built with React + Vite + TailwindCSS + Node.js + Express + MongoDB + Firebase + Gemini AI.

---

## ⚠️ IMPORTANT — Before You Start

### 1. Firebase Web Config (Required for client)
Open `client/.env` and replace the placeholder values with your **Firebase Web App** config.

Go to: [Firebase Console → Project Settings → Your Apps → Web App](https://console.firebase.google.com/project/hirepilotai-75ec0/settings/general)

Copy the config object and fill in:
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_MESSAGING_SENDER_ID=1234...
VITE_FIREBASE_APP_ID=1:1234...
```

### 2. Enable Firebase Auth Providers
Go to Firebase Console → Authentication → Sign-in method:
- ✅ Enable **Email/Password**
- ✅ Enable **Google**

### 3. Add localhost to Authorized Domains
Firebase Console → Authentication → Settings → Authorized domains:
- Add `localhost`

---

## 🚀 Installation & Running

### Server (Backend)
```bash
cd server
npm install
npm run dev
# Runs on http://localhost:5000
```

### Client (Frontend)
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

---

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
    └── .env                    # ✅ Already filled in
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
