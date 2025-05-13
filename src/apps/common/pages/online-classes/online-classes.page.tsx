import ContainerLayout from '@/components/page-layouts/container-layout'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import CreateLiveClassForm from '../../online-classes/create-live-class-form/create-live-class-form'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { EOnlineClassStatus, useGetOnlineClasses } from '../../../teacher/data-access/online-class-data-access'
import { useAuth } from '@/contexts/auth-provider'
import { Role } from '@/types/global.type'
import SearchInput from '@/components/search-components/search-input'
import ClassRoomSearchFilterInputs from '@/components/search-components/class-room-search'
import { FacetedFilter } from '@/components/data-table/faceted-filter'
import OnlineClassesList from '../../online-classes/online-classes-list'
import { FileQuestion, Plus } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { createQueryString } from '@/utils/create-query-string'
import { Card, CardContent } from '@/components/ui/card'

export default function OnlineClassesPage() {
    const { payload } = useAuth();
    const [searchParam] = useSearchParams();

    const { data, isLoading } = useGetOnlineClasses({
        queryString: createQueryString({
            page: searchParam.get('page'),
            take: searchParam.get('take'),
            search: searchParam.get('search'),
            classRoomId: searchParam.get('classRoomId'),
            sectionId: searchParam.get('sectionId'),
            skipPagination: true,
            status: searchParam.get('status'),
        })
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <ContainerLayout
            title="Live Classes"
            actionTrigger={payload?.role === Role.TEACHER && <CreateOnlineClassDialog />}
        >
            <OnlineClassesSearchFilters />
            {
                !!data?.data?.length ? (
                    <>
                        <section className='@container space-y-4'>
                            <OnlineClassesList onlineClasses={data?.data ?? []} />
                        </section>
                    </>
                ) : (
                    <Card className="w-full my-16 flex flex-col items-center justify-center p-6 border-none">
                        <CardContent className="text-center text-muted-foreground">
                            <FileQuestion className="w-24 h-24 mx-auto mb-4" />
                            <h2 className="md:text-2xl sm:text-xl text-base font-semibold mb-2">No Online Classes Found</h2>
                        </CardContent>
                    </Card>
                )
            }
        </ContainerLayout>
    )
}

function CreateOnlineClassDialog() {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    type="button"
                    onClick={() => setOpen(true)}
                >
                    <Plus /> Create Live Class
                </Button>
            </DialogTrigger>
            <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-[800px] w-[97%] max-h-[95vh] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Create Live Class</DialogTitle>
                    <DialogDescription>
                        Create a new live class by selecting your assigned class with subject and final details.
                    </DialogDescription>
                </DialogHeader>
                <CreateLiveClassForm setOpen={setOpen} />
            </DialogContent>
        </Dialog>

    )
}

function OnlineClassesSearchFilters() {
    const { payload } = useAuth()

    return (
        <section className='flex gap-2 lg:gap-5 flex-wrap justify-between items-end'>
            {
                payload?.role === Role.TEACHER && (
                    <section className="flex flex-wrap lg:gap-5 gap-3">
                        <SearchInput placeholder="Search by title" label="Title" />
                        <ClassRoomSearchFilterInputs />
                    </section>
                )
            }

            <FacetedFilter title="Status" searchKey="status" options={Object.entries(EOnlineClassStatus).map(([key, value]) => ({ label: key, value }))} />
        </section>
    )
}