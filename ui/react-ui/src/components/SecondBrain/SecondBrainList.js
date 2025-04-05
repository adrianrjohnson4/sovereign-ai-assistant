// --- This File lists the Notes from Firebase ---
import React, { useEffect, useState } from 'react';
import NoteModal from './Notes/NoteModal';
import { collection, getDocs } from "firebase/firestore";
import { db } from '../../firebase';

function SecondBrainList() {
    const [expandedId, setExpandedId] = useState(null);
    const [notes, setNotes] = useState([]);
    const [selectedNote, setSelectedNote] = useState(null);

    useEffect(() => {
        async function fetchNotes() {
            const notesCol = collection(db, "second_brain_notes");
            const noteSnapshot = await getDocs(notesCol);
            const noteList = noteSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(noteList);
        }

        fetchNotes();
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div>
        <h2>🧠 Saved Notes</h2>
        {notes.map(note => (
          <div 
          key={note.id} 
          style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem', cursor: 'pointer' }}
          onClick={() => setSelectedNote(note)}
          >
            <strong>📌 {note.tag.toUpperCase()}</strong> — {note.summary}
            <br />
            <em>{new Date(note.createdAt).toLocaleString()}</em>
            <br />
            {note.fileUrl && (
              <a href={note.fileUrl} target="_blank" rel="noopener noreferrer">📎 View File</a>
            )}
            <br />
            <button onClick={() => toggleExpand(note.id)}>
              {expandedId === note.id ? 'Hide Details' : 'View Details'}
            </button>
            {expandedId === note.id && (
              <div style={{ marginTop: '1rem' }}>
                <p><strong>📝 Full Note:</strong> {note.full_text}</p>
                {note.url && <p><strong>🔗 URL:</strong> <a href={note.url}>{note.url}</a></p>}
                {note.project && <p><strong>📁 Project:</strong> {note.project}</p>}
              </div>
            )}
          </div>
        ))}

        <NoteModal note={selectedNote} onClose={() => setSelectedNote(null)} />
      </div>
    );
}

export default SecondBrainList;
