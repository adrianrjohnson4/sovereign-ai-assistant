# 🧠 Sovereign Agent Developer Guide

This guide outlines the daily workflow to run and maintain your Sovereign AI Assistant locally.

---

## 🐍 Backend (FastAPI)

### 📍 Where to run:
Open terminal in this folder:
```
C:\Users\adria\OneDrive\Desktop\Sovereign AI\sovereign-agent-v1
```

### ▶️ Start the server:
```bash
python -m uvicorn api.main:app --reload
```

If `uvicorn` isn't installed:
```bash
pip install uvicorn
```

---

## ⚛️ Frontend (React UI)

### 📍 Where to run:
Open a **new terminal window** in your frontend folder:
```
C:\Users\adria\OneDrive\Desktop\Sovereign AI\sovereign-agent-v1\frontend
```

### ▶️ Start the React app:
```bash
npm start
```

This will open the app in your browser at:
```
http://localhost:3000
```

---

## 📦 Setup Notes

- Run `pip install -r requirements.txt` in your backend root if dependencies are missing.
- Run `npm install` in the React folder if node modules are missing.

---

## 🔁 Daily Flow

1. `python -m uvicorn api.main:app --reload` — Start your backend
2. `npm start` — Launch your frontend React interface
3. Add tasks, second brain entries, and see them persist in Firebase

---

Keep evolving sovereignly 🧘‍♂️
