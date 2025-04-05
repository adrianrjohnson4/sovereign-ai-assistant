from fastapi import APIRouter, UploadFile, Form, File
from api.firebase_utils import upload_file_to_storage, save_note_to_firestore
from api.vector_memory import save_note_to_pinecone
from firebase_admin import firestore, storage
from uuid import uuid4
from datetime import datetime

router = APIRouter()

@router.post("/add-note")
async def add_note(
    tag: str = Form(...),
    summary: str = Form(...),
    project: str = Form(...),
    url: str = Form(...),
    full_text: str = Form(...),
    file: UploadFile = File(None)
):
    db = firestore.client()
    note_id = str(uuid4())
    file_url = None

    if file:
        bucket = storage.bucket()
        blob = bucket.blob(f"second_brain_files/{note_id}_{file.filename}")
        blob.upload_from_file(file.file, content_type=file.content_type)
        file_url = blob.public_url

    note_data = {
        "summary": summary,
        "tag": tag,
        "project": project,
        "url": url,
        "full_text": full_text,
        "fileUrl": file_url,
        "createdAt": datetime.utcnow().isoformat()
    }

    db.collection("second_brain_notes").document(note_id).set(note_data)

    # --- Save to Pinecone ---
    metadata = {
        "summary": summary,
        "tag": tag,
        "project": project,
        "url": url
    }
    save_note_to_pinecone(note_id, full_text, metadata)

    return {"message": "🧠 Note added successfully!", "id": note_id}
