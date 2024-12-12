import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import "./StudentCalendarComponent.css";

interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
  studentName?: string;
}

const StudentCalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // ดึงเวลานัดหมายว่างจาก Backend (ตัวอย่าง)
    const mockEvents = [
      { id: "1", title: "Consultation", start: "2024-12-12T10:00:00", end: "2024-12-12T11:00:00" },
    ];
    setEvents(mockEvents);
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    const studentName = prompt("Enter your name to book this appointment:");
    if (studentName) {
      const updatedEvent = {
        ...clickInfo.event.extendedProps,
        studentName,
      };
      clickInfo.event.setExtendedProp("studentName", studentName);

      // บันทึกข้อมูลไปยัง Backend (ตัวอย่าง)
      // fetch(`/api/bookings/${clickInfo.event.id}`, { method: 'POST', body: JSON.stringify({ studentName }) });
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="timeGridWeek"
      events={events}
      eventClick={handleEventClick}
    />
  );
};

export default StudentCalendarComponent;
