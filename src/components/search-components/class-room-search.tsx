import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '../ui/label';
import { useGetSubjectOptions } from '@/apps/admin/components/subjects/data-access';
import { createQueryString } from '@/utils/create-query-string';
import { TFacultyOption, useFacultySearch } from '@/hooks/useFacultySearch';
import { TClassRoomOptions } from '@/types/class.type';

export const FACULTY_SEARCH_KEY = "facultyId"
export const CLASS_ROOM_SEARCH_KEY = "classRoomId"
export const SECTION_SEARCH_KEY = "sectionId"

type Props = {
    onlyClassRoom?: boolean;
    classRoomKey?: string;
    withSubjet?: boolean;
    include?: 'classRoom' | 'section';
}

export default function ClassRoomSearchFilterInputs({
    onlyClassRoom = false,
    classRoomKey = CLASS_ROOM_SEARCH_KEY,
    withSubjet = false,
    include = 'section',
}: Props) {
    const { setSearchParams, searchParams } = useCustomSearchParams();
    const [selectedFaculty, setSelectedFaculty] = useState<TFacultyOption>();
    const [selectedClassRoom, setSelectedClassRoom] = useState<TClassRoomOptions[0]>();

    const { data: faculties, isLoading } = useFacultySearch(createQueryString({ include }));

    const { data: subjects, isLoading: isLoadingSubjects } = useGetSubjectOptions({
        queryString: createQueryString({
            classRoomId: searchParams.get(classRoomKey),
        }),
        options: {
            enabled: (!!searchParams.get(classRoomKey) && withSubjet),
        }
    });

    useEffect(() => {
        if (!faculties) return;

        const facultyId = searchParams.get(FACULTY_SEARCH_KEY);

        if (facultyId) {
            const faculty = faculties.find((faculty) => faculty.id === facultyId);
            if (!faculty) {
                setSearchParams(FACULTY_SEARCH_KEY, undefined)
            } else {
                setSelectedFaculty(faculty);
            }
        }

        const classRoomId = searchParams.get(classRoomKey);

        if (classRoomId) {
            const classRoom = faculties?.find(f => f.classRooms?.find(c => c.id === classRoomId))?.classRooms?.find(c => c.id === classRoomId);
            if (!classRoom) {
                setSearchParams(classRoomKey, undefined)
            } else {
                setSelectedClassRoom(classRoom);
            }
        }

        const sectionId = searchParams.get(SECTION_SEARCH_KEY);

        if (sectionId) {
            const section = faculties?.find(f => f.classRooms?.find(c => c.id === classRoomId))?.classRooms?.find(c => c.id === classRoomId)?.children?.find(ch => ch.id === sectionId);
            if (!section) {
                setSearchParams(SECTION_SEARCH_KEY, undefined)
            }
        }
    }, [faculties])

    return (
        <>
            <div className="space-y-2">
                <Label>Faculty</Label>
                <Select
                    value={searchParams.get(FACULTY_SEARCH_KEY) ?? ''}
                    onValueChange={val => {
                        setSearchParams(FACULTY_SEARCH_KEY, val === 'reset' ? undefined : val);
                        setSearchParams(classRoomKey, undefined);
                        setSearchParams(SECTION_SEARCH_KEY, undefined);
                        setSelectedClassRoom(undefined);

                        const faculty = faculties?.find((faculty) => faculty.id === val);
                        setSelectedFaculty(faculty);
                    }}
                    disabled={!faculties?.length}
                >
                    <SelectTrigger className="min-w-[200px]">
                        <SelectValue placeholder="Select a faculty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="reset" className="text-xs text-muted-foreground">Select a faculty</SelectItem>
                            {faculties?.map(faculty => (
                                <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <section className='relative space-y-2'>
                <Label>Class</Label>
                <Select
                    value={searchParams.get(classRoomKey) ?? ''}
                    onValueChange={val => {
                        setSearchParams(classRoomKey, val === 'reset' ? undefined : val)
                        setSearchParams(SECTION_SEARCH_KEY, undefined)

                        const classRoom = selectedFaculty?.classRooms?.find((classRoom) => classRoom.id === val);
                        setSelectedClassRoom(classRoom);
                    }}
                    disabled={
                        !selectedFaculty?.classRooms?.length
                        || isLoading
                    }
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="reset" className='text-xs text-muted-foreground'>Select Class</SelectItem>
                            {
                                selectedFaculty?.classRooms?.map((classRoom) => (
                                    <SelectItem
                                        value={classRoom.id}
                                        key={classRoom.id}
                                    >
                                        {classRoom.name}
                                    </SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </section>

            {
                !onlyClassRoom && <section className='relative space-y-2'>
                    <Label>Section</Label>
                    <Select
                        value={searchParams.get("sectionId") ?? ''}
                        onValueChange={val => {
                            val === 'reset' ? setSearchParams('sectionId', undefined) : setSearchParams('sectionId', val)
                        }}
                        disabled={
                            !selectedClassRoom?.children?.length
                            || isLoading
                        }
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="reset" className='text-xs text-muted-foreground'>Select Section</SelectItem>
                                {
                                    selectedClassRoom?.children?.map((section) => (
                                        <SelectItem value={section.id} key={section.id}>{section.name}</SelectItem>
                                    ))
                                }
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </section>
            }

            {
                withSubjet && <section className='relative space-y-2'>
                    <Label className="">Subject</Label>
                    <Select
                        value={searchParams.get("subjectId") ?? ''}
                        onValueChange={val => {
                            val === 'reset' ? setSearchParams('subjectId', undefined) : setSearchParams('subjectId', val)
                        }}
                        disabled={
                            !searchParams.get(classRoomKey)
                            || !subjects?.length
                            || isLoadingSubjects
                        }
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="reset" className='text-xs text-muted-foreground'>Select Section</SelectItem>
                                {
                                    subjects?.map((subject) => (
                                        <SelectItem value={subject.id} key={subject.id}>{subject.subjectName}</SelectItem>
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