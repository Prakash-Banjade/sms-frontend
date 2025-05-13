import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetEvents } from "../events/data-access";
import { createQueryString } from "@/utils/create-query-string";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { differenceInDays, format, isSameMonth } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function UpcommingEvents() {
    const { data: events, isLoading } = useGetEvents({
        queryString: createQueryString({
            take: 3,
            dateFrom: format(new Date(), 'yyyy-MM-dd'),
            order: "ASC",
        }),
    });

    return (
        <Card className="w-full h-full">
            <CardHeader>
                <CardTitle>Upcomming Events</CardTitle>
                <CardDescription className="text-muted-foreground">Stay tuned for upcoming events</CardDescription>
            </CardHeader>
            <CardContent>
                <section className="space-y-3">
                    {isLoading && [...Array(2)].map((_, index) => <EventsLoadingSkeleton key={index} />)}
                    {
                        events?.data.map((event) => {
                            const difference = differenceInDays(new Date(event.dateTo), new Date(event.dateFrom));
                            const leaveFromDate = format(new Date(event.dateFrom), 'MMM dd');
                            const leaveToDate = format(new Date(event.dateTo), 'MMM dd');

                            const eventDaysString = difference > 0
                                ? isSameMonth(event.dateTo, event.dateFrom)
                                    ? `${difference + 1} days event (${leaveFromDate}-${format(event.dateTo, 'dd')})`
                                    : `${difference + 1} days event (${leaveFromDate} - ${leaveToDate})`
                                : `${difference + 1} day event (${leaveFromDate})`;

                            return (
                                <Card className="border-l-4 border-l-primary" key={event.id}>
                                    <CardHeader className="p-2 px-4">
                                        <CardTitle className="text-lg">{event.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-2 pb-3 px-4 pt-0">
                                        <div className="grid gap-2">
                                            <section className="flex gap-5 items-center">
                                                <div className="flex items-center space-x-2">
                                                    <CalendarDays className="h-4 w-4 opacity-70" />
                                                    <span className="text-sm">
                                                        {eventDaysString}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Clock className="h-4 w-4 opacity-70" />
                                                    <span className="text-sm">
                                                        {event.beginTime} - {event.endingTime}
                                                    </span>
                                                </div>
                                            </section>
                                            <div className="flex items-center space-x-2">
                                                <MapPin className="h-4 w-4 opacity-70" />
                                                <span className="text-sm">{event.eventLocation || <span className="text-muted-foreground italic">Not Specified</span>}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })
                    }
                    {events?.data?.length === 0 && (
                        <p className="text-muted-foreground text-sm text-center py-8">No upcoming events!</p>
                    )}
                </section>
            </CardContent>
        </Card>
    )
}

function EventsLoadingSkeleton() {
    return (
        <Card className="border-l-4 border-l-primary">
            <CardHeader className="p-2 px-4">
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="p-2 pb-3 px-4 pt-2">
                <div className="grid gap-3">
                    <section className="flex gap-5 items-center">
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                    </section>
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}