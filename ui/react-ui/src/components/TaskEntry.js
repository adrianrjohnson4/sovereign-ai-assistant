import { useState, useEffect } from 'react';

export default function TaskEntry() {
    const [taskText, setTaskText] = useState("");
    const [tasks, setTasks] = useState([]);

    const handleAddTask = async () => {
        if (!taskText.trim()) return;

        await fetch("http://localhost:8000/add-task", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ task: taskText, priority: 1, source: "manual" })
        });

        setTaskText("");
        fetchTasks();
    };

    const fetchTasks = async () => {
        const res = await fetch("http://localhost:8000/tasks");
        const data = await res.json();
        setTasks(data.tasks || []);
    }

    useEffect(() => {
        fetchTasks();
    }, [])

    return (
        <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Add Task</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          className="border p-2 flex-grow"
          placeholder="What do you want to do?"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <button onClick={handleAddTask} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-2">All Tasks</h3>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="border p-2 rounded">
            ✅ {task.task} — {task.status} (Priority: {task.priority})
          </li>
        ))}
      </ul>
    </div>
    )
}
