import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './academic-events-calendar.style.css'
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import EventForm, { eventFormDefaultValues } from '../events/events-form';
import { EventContentArg, EventDropArg, EventInput } from '@fullcalendar/core/index.js';
import { useGetEvents } from '../events/data-access';
import { TEvent } from '@/types/event.type';
import { DateRange } from '@fullcalendar/core/internal';
import { createQueryString } from '@/utils/create-query-string';
import { useAppMutation } from '@/hooks/useAppMutation';
import { QueryKey } from '@/react-query/queryKeys';
import { startOfDayString } from '@/lib/utils';

export function AcademicYearCalendar() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<TEvent | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<{ startDate: string, endDate: string } | undefined>(undefined);
  const [visibleRange, setVisibleRange] = useState<{ start: Date, end: Date } | null>(null);

  const { data: events, isLoading } = useGetEvents({
    queryString: createQueryString({
      dateFrom: visibleRange?.start.toISOString(),
      dateTo: visibleRange?.end.toISOString(),
      skipPagination: true,
    }),
    options: {
      enabled: visibleRange !== null,
    }
  });
  const { mutateAsync } = useAppMutation<{ dateFrom: string, dateTo: string }, { success: boolean }>();

  const handleDateSelect = (selectInfo: EventInput) => {
    const { start, end } = selectInfo;
    if (!start || !end) return;

    setSelectedDate({
      startDate: start.toString(),
      endDate: end.toString(),
    });

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

  const handleDatesSet = (dateInfo: DateRange) => {
    setVisibleRange({
      start: dateInfo.start,
      end: dateInfo.end
    });
  };

  const handleEventDrop = async (dropInfo: EventDropArg) => {
    console.log(dropInfo)
    if (!dropInfo.event || !dropInfo.event.start || !dropInfo.event.end) return;

    const eventId = dropInfo.event.id;
    const { start, end } = dropInfo.event;

    const response = await mutateAsync({
      method: 'patch',
      id: eventId,
      endpoint: QueryKey.EVENTS,
      data: {
        dateFrom: startOfDayString(start),
        dateTo: startOfDayString(end),
      },
      invalidateTags: [QueryKey.EVENTS],
      toastOnSuccess: false,
    })

    if (!response.data?.success) dropInfo.revert(); // revert the event if the mutation fails
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <ResponsiveDialog
        isOpen={isAddOpen}
        setIsOpen={setIsAddOpen}
        title={`Create New Event ${(selectedDate?.startDate === selectedDate?.endDate).toString()}`}
        className="w-[97%] max-w-[800px]"
      >
        <EventForm setIsOpen={setIsAddOpen} defaultValues={{ ...eventFormDefaultValues, dateFrom: selectedDate?.startDate, dateTo: selectedDate?.endDate }} />
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
          plugins={[dayGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            right: 'title',
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
            end: new Date(event.dateTo),
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
          datesSet={handleDatesSet}
          eventContent={renderEventContent}
          eventDrop={handleEventDrop}
        />
      </div>
    </>
  );
}

function renderEventContent(eventContent: EventContentArg) {
  return (
    <div className="space-x-1 !line-clamp-1">
      <strong className='!text-primary-foreground'>{eventContent.event.title}</strong>
    </div>
  );
}