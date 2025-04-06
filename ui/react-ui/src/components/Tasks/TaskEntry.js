import { useState, useEffect } from 'react';
import FocusTasks from './FocusTasks';

export default function TaskEntry() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState("");
  const [status, setStatus] = useState('todo');
  const [scheduledDate, setScheduledDate] = useState("");

  const handleAddTask = async () => {
    if (!taskText.trim()) return;

    await fetch("http://localhost:8000/add-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task: taskText,
        priority: 1,
        source: "manual",
        project,
        status,
        scheduledDate
      }),
    });

    setTaskText("");
    setProject("");
    setStatus('todo');
    setScheduledDate("");
    fetchTasks();
  };

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:8000/tasks");
    const data = await res.json();
    setTasks(data.tasks || []);
  }

  const handleToggleStatus = async(taskId, currentStatus) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    await fetch(`http://localhost:8000/update-task-status/${taskId}`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ status: newStatus }) 
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">✅ Tasks Dashboard</h2>

      <FocusTasks tasks={tasks} />

      <h2 className="text-xl font-bold mb-4">📝 Add Task</h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="What do you want to do?"
          className="border p-2 w-full"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />

        <input
          type="text"
          placeholder="Optional: Project or Tag"
          className="border p-2 w-full"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />

        <input
          type="date"
          className="border p-2 w-full"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
        />

        <select
          className="border p-2 w-full"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          ➕ Add Task
        </button>
      </div>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold mb-2">🗂️ All Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet. Add one to get started.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="border p-3 rounded">
              <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={() => handleToggleStatus(task.id, task.status)}
                />
                {task.status === 'done' ? <strong style={{textDecoration:'line-through',  color: '#6B7280'}}>🧠 {task.task}</strong> : <strong>🧠 {task.task}</strong>}

              <div className="text-sm text-gray-600">
                {task.project && <>📁 Project: {task.project} — </>}
                Status: {task.status} — Priority: {task.priority}
                {task.scheduledDate && <> — 📅 {task.scheduledDate}</>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
