import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './academic-events-calendar.style.css'

interface Event {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  allDay?: boolean;
}

export function AcademicYearCalendar() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Teacher Conference',
      start: new Date(2024, 2, 15),
      end: new Date(2024, 2, 17),
    },
    {
      id: '2',
      title: 'Final Exams',
      start: new Date(2024, 2, 20),
      end: new Date(2024, 2, 25),
    },
  ]);

  const handleDateSelect = (selectInfo: any) => {
    const title = prompt('Please enter a title for the event');
    if (title) {
      const newEvent: Event = {
        id: String(Date.now()),
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: selectInfo.allDay,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (clickInfo: any) => {
    if (confirm('Would you like to delete this event?')) {
      setEvents(events.filter(event => event.id !== clickInfo.event.id));
    }
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events}
        select={handleDateSelect}
        eventClick={handleEventClick}
        height="auto"
      />
    </div>
  );
}