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

    function parseDateLocal(isoString) {
        const date = new Date(isoString);
        const localISO = date.toISOString().split('T')[0]; // "2025-04-08"
        const parts = localISO.split('-');
        return new Date(parts[0], parts[1] - 1, parts[2]);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">🗓️ Calendar View</h2>
            <Calendar
                events={events}
                views={['month', 'agenda']}
                defaultView="month"
                startAccessor="start"
                endAccessor="end"
                localizer={localizer}
                allDayAccessor={() => true}
                style={{ height: 500 }}
                // Optional formatting tweak:
                formats={{ dayFormat: (date, culture, localizer) => localizer.format(date, 'MMM dd') }}
            />
            <button onClick={autoScheduleTasks}>Auto Schedule Tasks</button>
        </div>
    )
}