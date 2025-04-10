import React, { useEffect, useState } from "react";

export default function FocusTasks({ tasks = [] }) {
    const [focusTasks, setFocusTasks] = useState([]);
 

    useEffect(() => {
      const fetchTopTasks = async () => {
        const res = await fetch("http://localhost:8000/top-tasks");
        const data = await res.json();
        setFocusTasks(data.top_tasks || []);
        console.log(data)
      };
      fetchTopTasks();
    }, [])

    return (
        <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold mb-2">🎯 Today’s Focus</h3>
      {focusTasks.length === 0 ? (
        <p className="text-gray-500">Nothing urgent. You’re clear.</p>
      ) : (
        <ul className="space-y-2">
          {focusTasks.map((task, idx) => (
            <li key={task.id} className="border p-2 rounded">
              <strong>{idx + 1}. {task.task}</strong>
              <div className="text-sm text-gray-600">
                Priority: {task.priority} • Project: {task.project || "—"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    );
}