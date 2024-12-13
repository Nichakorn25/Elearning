import React, { useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg } from "@fullcalendar/core";
import "./TeacherCalendarComponent.css";

const TeacherCalendarComponent: React.FC = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState([
    { id: "1", title: "Meeting", start: "2024-12-12T10:00:00", end: "2024-12-12T11:00:00" },
  ]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const title = prompt("Enter a title for your event:");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      setEvents([
        ...events,
        { id: String(events.length + 1), title, start: selectInfo.startStr, end: selectInfo.endStr },
      ]);
    }
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (window.confirm(`Are you sure you want to delete '${clickInfo.event.title}'?`)) {
      setEvents(events.filter((event) => event.id !== clickInfo.event.id));
    }
  };

  return (
    <div className="teacher-calendar-fullscreen">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable
        editable
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
      />
    </div>
  );
};

export default TeacherCalendarComponent;
