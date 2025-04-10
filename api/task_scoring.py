from datetime import datetime, timezone
from api.firebase_utils import get_all_tasks

# My active Projects and goals (I can pull this later from firebase or config)
ACTIVE_PROJECTS = ["Vertical Integration", "Lead Intake Tab"]

def score_task(task):
    score = 0

    # 1. Priority boost
    score += task.get("priority", 1) * 2

    # 2. Project alignment
    project = task.get("propject", "").lower()
    if any(goal.lower() in project for goal in ACTIVE_PROJECTS):
        score += 3

    # 3. Date Relevance
    scheduled = task.get("scheduledDate", "")
    if scheduled:
        try:
            task_date = datetime.fromisoformat(scheduled).date()
            today = datetime.now(timezone.utc)
            if task_date <= today:
                score += 2
        except Exception:
            pass

    return score

def get_top_tasks(n=3):
    all_tasks = get_all_tasks()
    filtered = [t for t in all_tasks if t["status"].lower() != "done"]
    scored = sorted(filtered, key=score_task, reverse=True)
    return scored[:n]
