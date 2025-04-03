import os
import json
from datetime import datetime

# Example scoring logic based on keywords (Feed chat all my emails tell it to find the keywords and score them score them)
KEYWORD_SCORES = {
    "urgent": 5,
    "important": 4,
    "follow up": 3,
    "call": 3,
    "schedule": 2,
    "review": 1,
    "read": 1,
}

GOALS_FILE = "data/goals.json"
GOAL_BOOST = 2

def load_goals():
    if os.path.exists(GOALS_FILE):
        with open(GOALS_FILE, 'r') as f:
            return json.load(f)
    return{"weekly_goals": [], "long_term_goals": []}

def explain_task_reason(task, score, goals):
    task_lower = task.lower()
    reasons = []

    for keyword, value in KEYWORD_SCORES.items():
        if keyword in task_lower:
            reasons.append(f"matched keyword '{keyword}' (+{value})")
    
    for goal in goals.get("weekly_goals", []) + goals.get("long_term_goals", []):
        goal_keywords = goal.lower().split()
        if any(word in task_lower for word in goal_keywords):
            reasons.append(f"aligned with goal: \"{goal}\" (+{GOAL_BOOST})")
            break
    
    if not reasons:
            reasons.append("no strong match, included for completeness")
    return ", ".join(reasons)    

def score_task(task, goals):
    score = 0
    task_lower = task.lower()
    for keyword, value in KEYWORD_SCORES.items():
        if keyword in task_lower:
            score += value

    # Goal alignment boost
    for goal in goals.get("weekly_goals", []) + goals.get("long_term_goals", []):
        goal_keywords = goal.lower().split()
        if any(word in task_lower for word in goal_keywords):
            score += GOAL_BOOST
            break  # Only boost once per goal

    return score

def prioritize_tasks(task_list, goals):
    scored_tasks = [
        (task, score_task(task, goals), explain_task_reason(task, score_task(task, goals), goals)) 
        for task in task_list]
    scored_tasks.sort(key=lambda x: x[1], reverse=True)
    return scored_tasks

def write_prioritized_log(scored_tasks):
    today = datetime.now().strftime('%Y-%m-%d')
    os.makedirs("data/logs/", exist_ok=True)
    log_path = f"data/logs/{today}_prioritized.md"
    with open(log_path, "w") as f:
        f.write(f"# Prioritized task Log for {today}\n\n")
        for i, (task, score, reason) in enumerate(scored_tasks, 1):
            f.write(f"{i}. {task} (Score: {score}) - {reason}\n")
    return log_path

if __name__ == '__main__':
    sample_tasks = [
        "Follow up with Bob",
        "Review meeting notes",
        "Call new lead",
        "schedule design review",
        "Read article on FastAPI"
    ]
    goals = load_goals()
    prioritized = prioritize_tasks(sample_tasks, goals)
    log_file = write_prioritized_log(prioritized)
    print(f"Prioitized log written to {log_file}")
