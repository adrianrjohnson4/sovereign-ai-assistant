import React, { useState } from 'react';

function SecondBrain() {
    const [note, setNote] = useState({
        tag: '',
        summary: '',
        project: '',
        url: '',
        full_text: '',
        file: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setNote((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("tag", note.tag);
        formData.append("summary", note.summary);
        formData.append("project", note.project);
        formData.append("url", note.url);
        formData.append("full_text", note.full_text);
        
        if (note.file) {
            formData.append("file", note.file);
        }

        try {
            const response = await fetch('http://localhost:8000/add-note', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            alert('🧠 Note Saved!');
            console.log(result);
        } catch (error) {
            alert("Error saving note");
        }
    };

    return (
        <div>
        <h2>🧠 Save a New Insight</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>Tag:</label>
          <select name="tag" value={note.tag} onChange={handleChange}>
            <option value="">--Select--</option>
            <option value="meeting">Meeting Notes</option>
            <option value="reflection">Reflection</option>
            <option value="url">Saved Article</option>
          </select>
  
          <br /><label>Summary:</label>
          <input name="summary" value={note.summary} onChange={handleChange} />
  
          <br /><label>Project / Task (optional):</label>
          <input name="project" value={note.project} onChange={handleChange} />
  
          <br /><label>URL:</label>
          <input name="url" value={note.url} onChange={handleChange} />
  
          <br /><label>Note Text:</label>
          <textarea name="full_text" value={note.full_text} onChange={handleChange} />
  
          <br /><label>Attach File (PDF, image, etc):</label>
          <input type="file" name="file" onChange={handleChange} />
  
          <br /><button type="submit">Save Note</button>
        </form>
      </div>
    );
}

export default SecondBrain;