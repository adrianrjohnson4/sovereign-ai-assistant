import { useEffect, useState } from "react";

export default function FocusTasks({ tasks = [] }) {
    const [focusTasks, setFocusTasks] = useState([]);

    useEffect(() => {
        if (!tasks || tasks.length === 0) return;

        const boost = 3;

        // Filter incomplete tasks
        const pending = tasks.filter(task => task.staus !== "done");

        // Optional: Boost project if high priority
        const KEY_PROJECTS = ["Lead Intake Tab", "Vertical Integration"];
        const scored = pending.map(t => ({
            ...t,
            boostedScore: t.priority + (KEY_PROJECTS.includes(t.project) ? boost : 0)
        }));

        // Sort by boosted score
        const sorted = scored.sort((a, b) => b.boostedScore - a.boostedScore);

        // Pick top 3
        setFocusTasks(sorted.slice(0, 3));
    }, [tasks])

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