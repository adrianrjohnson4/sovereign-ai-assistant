import React from 'react';

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
    if (!note) return null;
  
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
  
          <h2>{note.summary}</h2>
          <p><strong>Tag:</strong> {note.tag}</p>
          <p><strong>Project:</strong> {note.project}</p>
          <p><strong>URL:</strong> <a href={note.url} target="_blank" rel="noreferrer">{note.url}</a></p>
          <p><strong>Note:</strong> {note.full_text}</p>
          {note.fileUrl && (
            <p><strong>File:</strong> <a href={note.fileUrl} target="_blank" rel="noreferrer">View Attachment</a></p>
          )}
          <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
            Saved: {new Date(note.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }
  
  export default NoteModal;