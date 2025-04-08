from fastapi import APIRouter, Request,  Body, Path
from pydantic import BaseModel
from api.firebase_utils import (
    add_task, get_all_tasks, update_task_status, 
    get_unscheduled_tasks, update_task_field, generate_open_slots)

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

# --- Route to auto Schedule tasks ---
@router.post("/auto-schedule-tasks")
def auto_schedule_tasks():
    tasks = get_unscheduled_tasks()
    print(f"✅ Step 1 — Found {len(tasks)} unscheduled tasks.")

    for task in tasks:
        print("    •", task["task"], "| status:", task["status"], "| scheduledDate:", task.get("scheduledDate"))

    available_slots = generate_open_slots()
    print(f"✅ Step 2 — Generated {len(available_slots)} slots: {available_slots}")

    scheduled_tasks = []

    for i, task in enumerate(tasks):
        if i < len(available_slots):
            task_id = task["id"]
            slot = available_slots[i]

            print(f"⏳ Step 3 — Assigning slot '{slot}' to task '{task['task']}' (ID: {task_id})")

            try:
                update_task_field(task_id, "scheduledDate", slot)
                print(f"✅ Step 4 — Updated task {task_id} with scheduledDate: {slot}")
                scheduled_tasks.append(task_id)
            except Exception as e:
                print(f"❌ Error updating task {task_id}: {e}")

    return {"scheduled": scheduled_tasks}
