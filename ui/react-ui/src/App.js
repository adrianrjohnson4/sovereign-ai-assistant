import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error("Failed to send message:", error);
      setResponse({ message: 'Failed to connect to backend.'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: 20, fontFamily: "sans-serif" }}>
    <h2>Sovereign AI - Task Chat</h2>
    <textarea
      style={{ width: "100%", height: 120 }}
      placeholder="Enter your tasks, e.g. Follow up with client, Write proposal, Call Bob"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
    />
    <button onClick={sendMessage} style={{ marginTop: 10, padding: "10px 20px" }}>
      {loading ? "Logging..." : "Log Tasks"}
    </button>

    {response && (
      <div style={{ marginTop: 20 }}>
        <h3>{response.message}</h3>
        {response.tasks && (
          <ul>
            {response.tasks.map((task, index) => (
              <li key={index}>{task}</li>
            ))}
          </ul>
        )}
        {response.log_file && <p>📝 Saved to: {response.log_file}</p>}
      </div>
    )}
  </div>
  )
}

export default App;
