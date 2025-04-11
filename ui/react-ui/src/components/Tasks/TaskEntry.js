import React, { useState, useEffect } from 'react';
import FocusTasks from './FocusTasks';
import TaskCalendar from '../Calendar/TaskCalendar';

export default function TaskEntry() {
  const [taskText, setTaskText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState("");
  const [status, setStatus] = useState('todo');
  const [scheduledDate, setScheduledDate] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [sortKey, setSortKey] = useState('date');
  const [groupByProject, setGroupByProject] = useState(false);

  const handleAddTask = async () => {
    if (!taskText.trim()) return;

    await fetch("https://sovereign-backend.onrender.com/add-task", {
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
    const res = await fetch("https://sovereign-backend.onrender.com/tasks");
    const data = await res.json();
    setTasks(data.tasks || []);
  }

  const handleToggleStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';
    await fetch(`https://sovereign-backend.onrender.com/update-task-status/${taskId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    fetchTasks();
  };

  const autoScheduleTasks = async () => {
    await fetch("https://sovereign-backend.onrender.com/auto-schedule-tasks", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    fetchTasks();
  }

  const formatDatePretty = (isoString) => {
    const [year, month, day] = isoString.split('T')[0].split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const filteredTasks = tasks
    .filter(task => !hideCompleted || task.status !== "done")
    .sort((a, b) => {
      if (sortKey === "priority") return b.priority - a.priority;
      if (sortKey === "project") return (a.project || "").localeCompare(b.project || "");
      if (sortKey === "date") return (a.scheduledDate || "").localeCompare(b.scheduledDate || "")
      return 0;
    })

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const key = task.project || "No Project";
    if (!groups[key]) groups[key] = [];
    groups[key].push(task);
    return groups;
  }, {})

  useEffect(() => {
    fetchTasks();
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">✅ Tasks Dashboard</h2>

      <FocusTasks tasks={tasks} />
      <TaskCalendar tasks={tasks} autoScheduleTasks={autoScheduleTasks} />

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
        <div>
          <div className="flex gap-4 mb-4 items-center">
            <label>
              <input
                type="checkbox"
                checked={hideCompleted}
                onChange={() => setHideCompleted(!hideCompleted)}
              />
              Hide Completed
            </label>

            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className='border p-1'>
              <option value="date">Sort by Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="project">Sort by Project</option>

            </select>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={groupByProject}
              onChange={() => setGroupByProject(!groupByProject)}
            />
            Group by Project
          </label>

          <ul className="space-y-2">
            {groupByProject ? (
              Object.entries(groupedTasks).map(([project, tasks]) => (
                <div key={project} className="mb-4">
                  <h4 className="text-md font-bold mb-1">📁 {project}</h4>
                  <ul className="space-y-2">
                    {tasks.map(task => (
                      <li key={task.id} className="border p-3 rounded flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={task.status === 'done'}
                          onChange={() => handleToggleStatus(task.id, task.status)}
                        />
                        <div className={task.status === 'done' ? 'line-through text-gray-500' : ''}>
                          <strong>🧠 {task.task}</strong>
                          <div className="text-sm text-gray-600">
                            Status: {task.status} — Priority: {task.priority}
                            {task.scheduledDate && <> — 📅 {formatDatePretty(task.scheduledDate)}</>}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <ul className="space-y-2">
                       {filteredTasks.map((task) => (
              <li key={task.id} className="border p-3 rounded">
                <input
                  type="checkbox"
                  checked={task.status === 'done'}
                  onChange={() => handleToggleStatus(task.id, task.status)}
                />
                {task.status === 'done' ? <strong style={{ textDecoration: 'line-through', color: '#6B7280' }}>🧠 {task.task}</strong> : <strong>🧠 {task.task}</strong>}

                <div className="text-sm text-gray-600">
                  {task.project && <>📁 Project: {task.project} — </>}
                  Status: {task.status} — Priority: {task.priority}
                  {task.scheduledDate && <> — 📅 {formatDatePretty(task.scheduledDate)}</>}
                </div>
              </li>
            ))}
              </ul>
            )}



          </ul>
        </div>

      )}


    </div>
  )
}
