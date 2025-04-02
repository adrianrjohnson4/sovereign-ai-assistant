import os
from datetime import datetime

# Very simple pattern for now: anything that starts with - or * is a task
TASK_MARKERS = ['- ', '* ']

INPUT_FILE = 'data/tasks/sample_input.txt'
OUTPUT_LOG_DIR = 'data/logs/'

def extract_tasks(file_path):
    tasks = []
    with open(file_path, 'r') as f:
        lines = f.readlines()
        for line in lines:
            if any(line.strip().startswith(marker) for marker in TASK_MARKERS):
                tasks.append(line.strip())
    return tasks

def write_daily_log(tasks):
    today = datetime.now().strftime('%Y-%m-%d')
    os.makedirs(OUTPUT_LOG_DIR, exist_ok=True)
    log_path = os.path.join(OUTPUT_LOG_DIR, f'{today}.md')

    with open(log_path, 'w') as f:
        f.write(f'# Task Log for {today}\n\n')
        for i, task in enumerate(tasks, 1):
            f.write(f'{i}. {task}\n')
    print(f"✅ Log written to {log_path}")

if __name__ == '__main__':
    tasks = extract_tasks(INPUT_FILE)
    write_daily_log(tasks)
    