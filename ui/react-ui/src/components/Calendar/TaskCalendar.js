import React, { useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = momentLocalizer(moment);

export default function TaskCalendar({ tasks, autoScheduleTasks }) {
    const events = tasks
        .filter(task => task.scheduledDate)
        .map(task => ({
            id: task.id,
            title: task.task,
            start: parseDateLocal(task.scheduledDate),
            end: parseDateLocal(task.scheduledDate),
            allDay: true,
        }));

        const events2 = [{
            id: '123',
            title: 'test task',
            start: parseDateLocal("2025-04-06"),
            end: parseDateLocal("2025-04-06"),
            allDay: true,
        }]

    useEffect(() => {
        console.log("This is tasks", tasks.map(t => t.scheduledDate))
        console.log("This is events2", events2)
    })

    function parseDateLocal(dateStr) {
        const [year, month, day] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day); // JS months are 0-based
      }

        return (
            <div className="p-4">
            <h2 className="text-xl font-bold mb-4">🗓️ Calendar View</h2>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
            />
            <button onClick={autoScheduleTasks}>Auto Schedule Tasks</button>
          </div> 
        )
}