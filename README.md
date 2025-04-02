# Sovereign AI Assistant

The Sovereign AI Assistant is a modular, autonomous system designed to reduce decision fatigue, manage tasks, and align daily actions with long-term goals — all while keeping the user in control.

## Features
- Modular AI agents for task extraction, prioritization, scheduling, and ethics monitoring
- Local-first design using Python, Markdown, and Obsidian for transparency and ownership
- React-based dashboard for daily summaries and overrides
- Optional GPT API + fallback to local models via LM Studio

## Setup
```bash
# Install backend requirements
pip install -r requirements.txt

# Run input agent to test
python agents/input_agent.py
```

## Folder Structure
project_root/
├── agents/
│   ├── input_agent.py             # Extracts tasks from input sources
│   ├── prioritization_agent.py    # Ranks tasks based on urgency, importance, etc.
│   ├── decision_agent.py          # Makes low-stakes decisions
│   ├── scheduling_agent.py        # Schedules tasks into calendar
│   ├── ethics_monitor.py          # Ensures AI stays aligned with sovereignty values
├── api/
│   └── main.py                    # FastAPI app entrypoint
├── ui/
│   └── react-app/                 # React frontend (can init with create-react-app)
├── data/
│   ├── logs/                      # Daily markdown/JSON logs
│   └── tasks/                     # Task snapshots, structured or plain text
├── llm_router.py                 # Routes between GPT-4, Claude, or local model
├── requirements.txt              # Python dependencies
└── README.md                     # Project overview and setup instructions

✅ Built to be simple, sovereign, and scalable — start small, evolve with clarity.
