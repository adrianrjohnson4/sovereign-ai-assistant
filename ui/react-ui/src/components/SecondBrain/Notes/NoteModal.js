import React, { useState, useEffect } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const modalStyle = {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '600px',
    width: '90%',
    position: 'relative',
};

function NoteModal({ note, onClose }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editNote, setEditNote] = useState(note || {});

// 🔁 Update editNote when a new note is passed in
    useEffect(() => {
        setEditNote(note || {});
        setIsEditing(false);
    }, [note]);

    if (!note) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditNote(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const docRef = doc(db, "second_brain_notes", note.id);
        await updateDoc(docRef, {
            tag: editNote.tag || "",
            summary: editNote.summary || "",
            full_text: editNote.full_text || "",
            url: editNote.url || "",
            project: editNote.project || ""
        });
        setIsEditing(false);
        onClose();
    };

    const handleDelete = async () => {
        const docRef = doc(db, "second_brain_notes", note.id);
        await deleteDoc(docRef);
        onClose();
    }

    return (
        <div style={modalStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                    }}
                >
                    &times;
                </button>

                <h3>{isEditing ? '✏️ Edit Note' : '🧠 Note Details'}</h3>

                {isEditing ? (
                    <>
                        <label>Summary:</label>
                        <input name="summary" value={editNote.summary} onChange={handleChange} />
                        <label>Full Text:</label>
                        <textarea name="full_text" value={editNote.full_text} onChange={handleChange} />
                        <label>URL:</label>
                        <input name="url" value={editNote.url} onChange={handleChange} />
                        <label>Project:</label>
                        <input name="project" value={editNote.project} onChange={handleChange} />
                        <label>Tag:</label>
                        <input name="tag" value={editNote.tag} onChange={handleChange} />
                        <br />
                        <button onClick={handleSave}>💾 Save</button>
                    </>
                ) : (
                    <>
                        <p><strong>Summary:</strong> {note.summary}</p>
                        <p><strong>Full Text:</strong> {note.full_text}</p>
                        {note.url && <p><strong>URL:</strong> <a href={note.url} target="_blank">{note.url}</a></p>}
                        {note.project && <p><strong>Project:</strong> {note.project}</p>}
                        <p><strong>Tag:</strong> {note.tag}</p>
                    </>
                )}
                <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
                    Saved: {new Date(note.createdAt).toLocaleString()}
                </p>

                <br />
                <button onClick={() => setIsEditing(!isEditing)}>{isEditing ? 'Cancel' : '✏️ Edit'}</button>
                <button onClick={handleDelete} style={{ color: 'red', marginLeft: '1rem' }}>🗑️ Delete</button>
            </div>
        </div>
    );
}

export default NoteModal;