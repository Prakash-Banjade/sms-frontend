import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useGetClassRoomsOptions } from '@/apps/admin/components/class-rooms/actions';
import { useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '../ui/label';

type Props = {
    onlyClassRoom?: boolean;
    classRoomKey?: string;
}

export default function ClassRoomSearchFilterInputs({ onlyClassRoom = false, classRoomKey = "classRoomId" }: Props) {
    const { setSearchParams, searchParams } = useCustomSearchParams();

    const { data, isLoading } = useGetClassRoomsOptions({
        queryString: 'page=1&take=50',
    });

    useEffect(() => {
        setSearchParams("sectionId", undefined)
    }, [searchParams.get(classRoomKey)])

    // remove invalid searchParams, like classRoomId=xyz and sectionId=xyz
    useEffect(() => {
        if (!data) return;

        const classRoomId = searchParams.get(classRoomKey);
        const isCorrectClassRoomId = data?.find((classRoom) => classRoom.id === classRoomId);

        if (classRoomId && !isCorrectClassRoomId) {
            setSearchParams(classRoomKey, undefined)
        }

        const sectionId = searchParams.get("sectionId");
        const isCorrectSectionId = isCorrectClassRoomId?.children?.find((section) => section.id === sectionId);

        if (sectionId && !isCorrectSectionId) {
            setSearchParams("sectionId", undefined)
        }
    }, [data])

    return (
        <>
            <section className='relative space-y-2'>
                <div className="">
                    <Label className="">
                        Class
                    </Label>
                </div>
                <Select
                    value={searchParams.get(classRoomKey) ?? ''}
                    onValueChange={val => {
                        val === 'reset' ? setSearchParams(classRoomKey, undefined) : setSearchParams(classRoomKey, val)
                    }}
                    disabled={isLoading}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="reset" className='text-muted-foreground'>Select Class</SelectItem>
                            {
                                data?.map((classRoom) => (
                                    <SelectItem value={classRoom.id} key={classRoom.id}>{classRoom.name}</SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </section>

            {
                !onlyClassRoom && <section className='relative space-y-2'>
                    <div className="">
                        <Label className="">
                            Section
                        </Label>
                    </div>
                    <Select
                        value={searchParams.get("sectionId") ?? ''}
                        onValueChange={val => {
                            val === 'reset' ? setSearchParams('sectionId', undefined) : setSearchParams('sectionId', val)
                        }}
                        disabled={
                            !searchParams.get(classRoomKey)
                            || !data?.find((classRoom) => classRoom.id === searchParams.get(classRoomKey))?.children?.length
                            || isLoading
                        }
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="reset" className='text-muted-foreground'>Select Section</SelectItem>
                                {
                                    data?.find((classRoom) => classRoom.id === searchParams.get(classRoomKey))?.children?.map((section) => (
                                        <SelectItem value={section.id} key={section.id}>{section.name}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </section>
            }
        </>
    )
}