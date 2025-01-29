import { useMemo, useState } from 'react'
import ClassRoutineForm from '../../components/class-routine/class-routine.form'
import ContainerLayout from '@/components/aside-layout.tsx/container-layout'
import { useGetClassRoutines } from '../../components/class-routine/actions';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ClassRoutineCard } from '../../components/class-routine/routines-display-list';
import { sortClassRoutines } from '@/lib/utils';

export default function AddClassRoutinePage() {
    const [queryString, setQueryString] = useState('');

    return (
        <ContainerLayout
            title="Add New Class Routine"
            description="Select a class, assign the subjects and add the class routine to your school management system."
        >
            <section className='@container/main'>
                <section className='grid @5xl/main:grid-cols-3 grid-cols-1 @5xl/main:gap-x-6 gap-y-6'>
                    <Card className='col-span-2 h-fit'>
                        <CardContent className='p-6'>
                            <ClassRoutineForm setQueryString={setQueryString} />
                        </CardContent>
                    </Card>

                    <Card className='h-full @container/secondary'>
                        <CardHeader>
                            <h2 className='@6xl:text-2xl text-xl font-semibold mb-4'>
                                Existing Schedules for the day
                            </h2>
                        </CardHeader>
                        <CardContent>
                            <ExistingSchedules queryString={queryString} />
                        </CardContent>
                    </Card>
                </section>
            </section>
        </ContainerLayout>
    )
}

const ExistingSchedules = ({ queryString }: { queryString: string }) => {
    const params = new URLSearchParams(queryString);

    const hasSelected = params.get("classRoomId") !== null && params.get("dayOfTheWeek") !== null;

    const { data, isLoading } = useGetClassRoutines({
        queryString: queryString + '&skipPagination=true',
        options: {
            enabled: hasSelected,
        }
    });

    const sortedSchedule = useMemo(() => sortClassRoutines(data?.data ?? []), [data]);

    if (!hasSelected) return <div className='py-20 text-muted-foreground text-sm text-center'>Select a class and day of the week to view existing schedules</div>;

    if (isLoading) return <div>Loading...</div>;

    if (!data?.data?.length) return <div className='py-20 text-muted-foreground text-sm text-center'>No existing schedules found</div>;

    return (
        <section className='grid @3xl:grid-cols-3 @lg/secondary:grid-cols-2 grid-cols-1 gap-4'>
            {
                sortedSchedule?.map((classRoutine) => (
                    <ClassRoutineCard key={classRoutine.id} classRoutine={classRoutine} />
                ))
            }
        </section>
    )
}