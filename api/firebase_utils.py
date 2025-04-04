import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate("api/firebase_credentials.json")
    firebase_admin.initialize_app(cred)

    db = firestore.client()

    def add_task(task_text, priority=1, source="manual"):
        task_data = {
            "task": task_text,
            "status": "To Do",
            "priority": priority,
            "source": source,
            "created_at": datetime.utcnow(),
            "isTop3Today": False
        }
        return db.collection("tasks").add(task_data)
    
    def get_all_tasks():
        tasks = db.collection("tasks").order_by("created_at", direction=firestore.Query.DESCENDING).stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in tasks]
    
    def get_top_3_tasks():
        tasks = db.collection("tasks").where("isTop3Today", "==", True).order_by("priority", direction=firestore.Query.DESCENDING).limit(3).stream()
        return [{**doc.to_dict(), "id": doc.id} for doc in tasks]
    
    def update_task_status(task_id, new_status):
        db.collection("tasks").document(task_id).update({"status": new_status})

    def mark_task_as_top3(task_id, is_top=True):
        db.collection("task").document(task_id).update({"isTop3Today": is_top})

    def clear_top3_flags():
        tasks = db.collection("tasks").where("isTop3Today", "==", True).stream()
        for doc in tasks:
            db.collection("tasks").document(doc.id).update({"isTop3Today": False})