from fastapi import APIRouter, Request,  Body, Path
from pydantic import BaseModel
from api.firebase_utils import add_task, get_all_tasks, update_task_status

router = APIRouter()

# --- Input schema for creating a task ---
class TaskCreate(BaseModel):
    task: str
    priority: int = 1
    source: str = "manual"
    scheduledDate: str = ""
    status: str = "todo"

# --- Updating the status of the Task ---
class UpdateStatusRequest(BaseModel):
    status: str

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

# --- Route to get all tasks ---
@router.get("/tasks")
def fetch_tasks():
    tasks = get_all_tasks()
    return {"tasks": tasks}

# --- Route to update status ---
@router.post('/update-task-status/{task_id}')
def update_task(task_id: str = Path(...), request: UpdateStatusRequest = Body(...)):
    update_task_status(task_id, request.status)
    return {"message": f"✅ Task {task_id} updated to {request.status}"}
