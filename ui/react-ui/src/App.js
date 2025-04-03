import React, { useState } from 'react';

function App() {
  const [message, setMessage] = useState("");
  const [tasks, setTasks] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(false);
  const [showWhy, setShowWhy] = useState({});
  const [reasons, setReasons] = useState([]);

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
      setTasks(data.prioritize_tasks || []);
      setCompleted({});
      setTasks(data.prioritize_tasks.map(([task, score, reason]) => [task, score, reason]));
      setReasons(data.prioritize_tasks.map(([_, __, reason]) => reason));
      setShowWhy({});
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = (index) => {
    setCompleted((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  const toggleWhy = (index) => {
    setShowWhy((prev) => ({ ...prev, [index]: !prev[index] }));
  }

  const displayedTasks = showAll ? tasks : tasks.slice(0, 3);

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Sovereign Task Prioritizer</h2>

      <textarea
        style={{ width: "100%", height: 120 }}
        placeholder="Enter your tasks here, separated by commas or new lines"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage} style={{ marginTop: 10, padding: "10px 20px" }}>
        {loading ? "Prioritizing..." : "Prioritize Tasks"}
      </button>

      {tasks.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h3>🧠 Recommended Focus:</h3>
          <p style={{ fontStyle: "italic", color: "gray" }}>
            Your assistant recommends focusing on these first.
          </p>

          <ul>
            {displayedTasks.map(([task, score], i) => (
              <li
                key={i}
                style={{
                  margin: "10px 0",
                  textDecoration: completed[i] ? "line-through" : "none",
                  opacity: completed[i] ? 0.5 : 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <input
                    type="checkbox"
                    checked={completed[i] || false}
                    onChange={() => toggleComplete(i)}
                  />
                  <span>
                    {score >= 5 ? "🔥 " : ""}
                    {task}{" "}
                    <span style={{ fontSize: "0.85em", color: "gray" }}>
                      (Score: {score})
                    </span>
                  </span>
                  <button onClick={() => toggleWhy(i)} style={{ border: "none", background: "none", cursor: "pointer" }}>
                    🧐
                  </button>
                </div>
                {showWhy[i] && (
                  <div style={{ marginLeft: 30, fontSize: "0.85em", color: "gray" }}>
                    {reasons[i]}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {tasks.length > 3 && (
            <button onClick={() => setShowAll((s) => !s)} style={{ marginTop: 10 }}>
              {showAll ? "Show Top 3 Only" : "Show All Tasks"}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default App;
