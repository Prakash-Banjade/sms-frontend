import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useGetClassRoomsOptions } from '@/apps/admin/components/class-rooms/actions';
import { HTMLAttributes, useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '../ui/label';

type Props = {}

export default function ClassRoomSearchFilterInputs({ }: Props) {
    const { setSearchParams, searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetClassRoomsOptions({
        queryString: 'page=1&take=50',
    });

    useEffect(() => {
        setSearchParams("sectionId", undefined)
    }, [searchParams.get("classRoomId")])

    return (
        <>
            <section className='relative space-y-2'>
                <div className="">
                    <Label className="">
                        Class
                    </Label>
                    <ResetBtn onClick={() => setSearchParams("classRoomId", undefined)} />
                </div>
                <Select value={searchParams.get("classRoomId") ?? ''} onValueChange={val => setSearchParams("classRoomId", val)} disabled={isLoading}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                data?.data?.map((classRoom) => (
                                    <SelectItem value={classRoom.id} key={classRoom.id}>{classRoom.name}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </section>

            <section className='relative space-y-2'>
                <div className="">
                    <Label className="">
                        Section
                    </Label>
                    <ResetBtn onClick={() => setSearchParams("sectionId", undefined)} />
                </div>
                <Select
                    value={searchParams.get("sectionId") ?? ''}
                    onValueChange={val => setSearchParams("sectionId", val)}
                    disabled={
                        !searchParams.get('classRoomId')
                        || !data?.data?.find((classRoom) => classRoom.id === searchParams.get('classRoomId'))?.children?.length
                        || isLoading
                    }
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {
                                data?.data?.find((classRoom) => classRoom.id === searchParams.get('classRoomId'))?.children?.map((section) => (
                                    <SelectItem value={section.id} key={section.id}>{section.name}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </section>
        </>
    )
}

function ResetBtn(props: HTMLAttributes<HTMLButtonElement>) {
    return (
        <button type="button" className="text-muted-foreground text-sm absolute right-0 mt-[2px]" {...props}>
            Clear
        </button>
    )
}