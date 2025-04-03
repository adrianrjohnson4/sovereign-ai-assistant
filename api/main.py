from fastapi import FastAPI, Request
from pydantic import BaseModel
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import os

from agents.prioritization_agent import prioritize_tasks, load_goals

app = FastAPI()

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
        for i, (task, score) in enumerate(scored_tasks, 1):
            f.write(f"{i}. {task} (Score: {score})\n")
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
