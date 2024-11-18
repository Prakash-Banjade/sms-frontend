import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './academic-events-calendar.style.css'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import EventForm from '../events/events-form';
import { EventInput } from '@fullcalendar/core/index.js';
import { useGetEvents } from '../events/data-access';
import { TEvent } from '@/types/event.type';

export function AcademicYearCalendar() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: events, isLoading } = useGetEvents({});
  const [selectedEvent, setSelectedEvent] = useState<TEvent | undefined>(undefined);

  const handleDateSelect = (selectInfo: EventInput) => {
    console.log(selectInfo)
    setIsAddOpen(true);
  };

  const handleEventClick = (clickInfo: any) => {
    const def = clickInfo.event._def;
    setIsEditOpen(true);
    setSelectedEvent({
      id: def.publicId,
      title: def.title,
      description: def.extendedProps?.description,
      dateFrom: def.extendedProps?.dateFrom,
      dateTo: def.extendedProps?.dateTo,
      eventLocation: def.extendedProps?.eventLocation,
      members: def.extendedProps?.members,
      createdAt: def.extendedProps?.createdAt,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <ResponsiveDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title="Create New Event"
        className="w-[97%] max-w-[800px]"
      >
        <EventForm setIsOpen={setIsAddOpen} />
      </ResponsiveDialog>

      <ResponsiveDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        title="Edit Event"
        className="w-[97%] max-w-[800px]"
      >
        <EventForm
          setIsOpen={setIsEditOpen}
          eventId={selectedEvent?.id!}
          defaultValues={selectedEvent!}
        />
      </ResponsiveDialog>

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
          events={events?.data?.map(event => ({
            id: event.id,
            title: event.title,
            start: event.dateFrom,
            end: event.dateTo,
            description: event.description,
            eventLocation: event.eventLocation,
            members: event.members,
            dateFrom: event.dateFrom,
            dateTo: event.dateTo,
            createdAt: event.createdAt,
          }))}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
        />
      </div>
    </>
  );
}