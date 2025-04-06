from fastapi import APIRouter, Request
from pydantic import BaseModel
from api.firebase_utils import add_task, get_all_tasks

router = APIRouter()

# --- Input schema for creating a task ---
class TaskCreate(BaseModel):
    task: str
    priority: int = 1
    source: str = "manual"
    scheduledDate: str = ""
    status: str = "todo"

# --- Route to add a new task ---
@router.post("/add-task")
def add_new_task(item: TaskCreate):
    add_task(
        task_text=item.task, 
        priority=item.priority, 
        source=item.source, 
        scheduledDate=item.scheduledDate,
        status=item.status
        )
    return {"message": "✅ Task added successfully."}

# --- Route tp get all tasks ---
@router.get("/tasks")
def fetch_tasks():
    tasks = get_all_tasks()
    return {"tasks": tasks}
