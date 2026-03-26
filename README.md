# 🦾 PRINCE KUMAR — FULL STACK PORTFOLIO

#  I think i should delete this portfolio from my repo cause i am not spending timne on it ;


> Iron Man themed personal portfolio with a real **Node.js REST API backend** + animated frontend.

---

## 🗂 Project Structure

```
portfolio/
├── backend/
│   └── server.js          ← Node.js HTTP server (REST API)
├── frontend/
│   └── public/
│       ├── index.html     ← Main portfolio page
│       ├── css/
│       │   └── style.css  ← Iron Man themed styles
│       └── js/
│           └── app.js     ← Frontend JS (API calls + animations)
├── package.json
└── README.md

```

---

## 🚀 How to Run

### Requirements
- **Node.js v16+** (no npm packages needed — uses only built-in modules)

### Step 1 — Start the server
```bash
cd portfolio
node backend/server.js
```

### Step 2 — Open in browser
```
http://localhost:5000
```

That's it! The server serves both the frontend AND the API from port 5000.

---

## 📡 REST API Endpoints

| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | `/api/health`      | Server health check      |
| GET    | `/api/profile`     | Developer profile data   |
| GET    | `/api/projects`    | All portfolio projects   |
| GET    | `/api/skills`      | All technical skills     |
| GET    | `/api/hackathons`  | Hackathon history        |
| GET    | `/api/stats`       | Live visitor & stats     |
| POST   | `/api/contact`     | Submit contact message   |
| GET    | `/api/messages`    | View received messages   |

### Example API call
```bash
curl http://localhost:5000/api/projects
curl http://localhost:5000/api/stats
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Tony","email":"tony@stark.com","message":"Nice portfolio!"}'
```

---

## 🔧 Customize

Edit `backend/server.js` → `DATA` object to update:
- Profile info
- Projects
- Skills
- Hackathons

---

## 🌐 Deploy to Production

### Option 1: Railway / Render / Fly.io
- Push to GitHub
- Connect repo → set start command: `node backend/server.js`

### Option 2: VPS (Linux)
```bash
git clone <your-repo>
cd portfolio
node backend/server.js &
```

### Option 3: GitHub Pages (frontend only)
- Copy `frontend/public/*` to your GitHub Pages repo
- Change `const API = ''` in `app.js` to your deployed API URL

---

## 📬 Contact
- **Email:** rajprincekumar99550@gmail.com
- **Phone:** +91 7870496423
- **LinkedIn:** https://www.linkedin.com/in/prince-yadav-a8886a312/
- **GitHub:** https://github.com/Prinxeyadav

---

*Built with Node.js (zero dependencies) · Iron Man theme · 2025*
