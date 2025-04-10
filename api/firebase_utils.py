import os
import base64
import json
import firebase_admin
from firebase_admin import credentials, firestore, storage
from uuid import uuid4
from datetime import datetime, timedelta, timezone, time

firebase_base64 = os.getenv("FIREBASE_CREDENTIALS_BASE64")
firebase_dict = json.leads(base64.b64decode(firebase_base64).decode("utf-8"))
cred = credentials.Certificate(firebase_dict)

# Initialize Firebase only once
if not firebase_admin._apps:
    cred = credentials.Certificate("firebase_credentials.json")
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'sovereignagent-9241b.firebasestorage.app'
    })

    db = firestore.client()
    bucket = storage.bucket()

    # --- Task Methods Section ---

    def add_task(task_text, status="todo", scheduledDate="", priority=1, source="manual"):
        task_data = {
            "task": task_text,
            "status": status,
            "priority": priority,
            "source": source,
            "created_at": datetime.now(timezone.utc),
            "isTop3Today": False,
            "scheduledDate": scheduledDate or ""
        }
        if scheduledDate:
            if isinstance(scheduledDate, str):
                scheduledDate = datetime.fromisoformat(scheduledDate)
            elif isinstance(scheduledDate, date):
                scheduledDate = datetime.combine(scheduledDate, time.min)
            task_data["scheduledDate"] = scheduledDate


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

    # --- Storage Section ---
    def save_note_to_firestore(notes_data):
        notes_ref = db.collection("second_brain_notes")
        notes_ref.add(notes_data)

    async def upload_file_to_storage(file):
        extension = file.filename.split(".")[-1]
        blob_name = f"notes/{uuid4()}.{extension}"
        blob = bucket.blob(blob_name)
        content = await file.read()
        blob.upload_from_string(content, content_type=file.content_type)
        blob.make_public()
        return blob.public_url
    
    # --- Calendar Auto Scheduling ---
    def get_unscheduled_tasks():
        tasks = db.collection("tasks")\
            .where("status", "in", ["todo", "in progress"])\
            .order_by("priority", direction=firestore.Query.DESCENDING)\
            .stream()

        result = []
        for doc in tasks:
            data = doc.to_dict()
            task_id = doc.id

            scheduled = data.get("scheduledDate")
            print(f"📝 Task: {data['task']}, ID: {task_id}, scheduledDate: {repr(scheduled)}")
            if not scheduled or isinstance(scheduled, str):
                result.append({**data, "id": doc.id})

        print(f"➡️ Found {len(result)} unscheduled tasks")
        return result
    
    def generate_open_slots(days_ahead=5):
        today = datetime.now(timezone.utc).date() 
        slots = []
        for i in range(days_ahead):
            slot = today + timedelta(days=i)
            slots.append(date_to_datetime(slot))
        return slots
    
    def update_task_field(task_id, field, value):
        db.collection("tasks").document(task_id).update({field: value})

    # --- Convert datetime.date → datetime.datetime ---
    def date_to_datetime(d):
        return datetime.combine(d, time.min)
  
