import React from 'react';

function DetailNote({ note }) {
    if (!note) return <p>No note selected.</p>;

    return (
        <div className="p-4 border rounded-xl shadow-md max-w-2xl mx-auto mt-4">
        <h2 className="text-xl font-bold mb-2">{note.summary}</h2>

        <div className="text-sm text-gray-500 mb-4">
            <span className="mr-2">Tag: <strong>{note.tag}</strong></span>
            <span>Project: <strong>{note.project || 'N/A'}</strong></span>
        </div>

        <p className="mb-4"><strong>Full Text:</strong><br />{note.full_text}</p>

        {note.url && (
            <p className="mb-2">
                <strong>URL:</strong> <a href={note.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{note.url}</a>
            </p>
        )}

        {note.fileUrl && (
            <div className="mt-4">
                <p><strong>Attached File:</strong></p>
                <a href={note.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View File</a>
            </div>
        )}

        <div className="text-xs text-gray-400 mt-4">
            Created At: {new Date(note.createdAt).toLocaleString()}
        </div>
    </div>
    );
}

export default DetailNote;
