// --- This File lists the Notes from Firebase ---
import React, { useState } from 'react';

const mockNotes = [
    {
        id: '1',
        tag: 'meeting',
        summary: 'Weekly ops meeting takeaways',
        project: 'Internal Sync',
        url: 'https://example.com/meeting-notes',
        full_text: 'Discussed Q2 milestones, blocked items, and integration priorities.',
        fileUrl: 'https://example.com/attached-file.pdf',
        createdAt: '2025-04-05T17:00:00Z',
      },
      {
        id: '2',
        tag: 'reflection',
        summary: 'Deep work productivity insights',
        project: '',
        url: '',
        full_text: 'Realized that time-blocking works best when aligned with ultradian rhythm breaks.',
        fileUrl: null,
        createdAt: '2025-04-04T11:30:00Z',
      }, 
];

function SecondBrainList() {
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div>
        <h2>🧠 Saved Notes</h2>
        {mockNotes.map(note => (
          <div key={note.id} style={{ border: '1px solid #ccc', margin: '1rem 0', padding: '1rem' }}>
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
      </div>
    );
}

export default SecondBrainList;
