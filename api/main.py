from fastapi import FastAPI, Request
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import task_routes
import note_routes
import os
import base64
import tempfile
from firebase_admin import credentials, initialize_app

if not firebase_admin._apps:
    # Read and decode the base64 credentials
    encoded = os.getenv("FIREBASE_CREDS_BASE64")
    decoded = base64.b64decode(encoded)

    # Save to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".json") as tmp:
        tmp.write(decoded)
        tmp.flush()
        cred = credentials.Certificate(tmp.name)
        initialize_app(cred, {
            'storageBucket': 'sovereignagent-9241b.firebasestorage.app'
        })

app = FastAPI()
app.include_router(task_routes.router)
app.include_router(note_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# --- Helper: write task log to markdown ---
def write_log(tasks):
    today = datetime.now().strftime('%Y-%m-%d')
    os.makedirs("data/logs/", exist_ok=True)
    log_path = f"data/logs/{today}.md"
    with open(log_path, "w") as f:
        f.write(f"# Task Log for {today}\n\n")
        for i, task in enumerate(tasks, 1):
            f.write(f"{i}. {task}\n")
    return log_path

# --- Helper: Write Prioritized log ---
def write_prioritized_log(scored_tasks):
    today = datetime.now().strftime('%Y-%m-%d')
    os.makedirs("data/logs/", exist_ok=True)
    log_path = f"data/logs/{today}_prioritized.md"
    with open(log_path, "w") as f:
        f.write(f"# Prioritized Task Log for {today}\n\n")
        for i, (task, score, reason) in enumerate(scored_tasks, 1):
            f.write(f"{i}. {task} (Score: {score}) — {reason}\n")
    return log_path

# --- Pydantic model for input validation ---
class TaskInput(BaseModel):
    message: str

# --- Basic extraction: split by comma or newline ---
def extract_tasks_from_message(message: str):
    raw_tasks = [t.strip() for t in message.replace('\n', ',').split(',') if t.strip()]
    return raw_tasks

# --- Main Endpoint ---
@app.post("/chat")
def chat(input: TaskInput):
    tasks = extract_tasks_from_message(input.message)
    log_path = write_log(tasks)
    goals = load_goals()
    prioritized = prioritize_tasks(tasks, goals)
    prioritize_log = write_prioritized_log(prioritized)
    return {
        "message": f"✅ {len(tasks)} tasks logged and prioritized.",
        "log_file": log_path,
        "prioritize_log": prioritize_log,
        "prioritize_tasks": prioritized 
    }
