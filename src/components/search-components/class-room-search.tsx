import { useCustomSearchParams } from '@/hooks/useCustomSearchParams';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '../ui/label';
import { useGetSubjectOptions } from '@/apps/admin/components/subjects/data-access';
import { createQueryString } from '@/utils/create-query-string';
import { TFacultyOption, useFacultySearch } from '@/hooks/useFacultySearch';
import { TClassRoomOptions } from '@/apps/admin/types/class.type';
import { StaticCombobox } from '../ui/static-combobox';

export const FACULTY_SEARCH_KEY = "facultyId" as const;
export const CLASS_ROOM_SEARCH_KEY = "classRoomId" as const;
export const SECTION_SEARCH_KEY = "sectionId" as const;
export const SEARCH_QUERY_RESET = "searchQueryReset" as const;

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
    const [selectedSection, setSelectedSection] = useState<TClassRoomOptions[0]["children"][0]>();

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
            } else {
                setSelectedSection(section);
            }
        }
    }, [faculties]);

    useEffect(() => { // this is to reset the combobox when the search query is reset from datatable, because the state of combobox is managed by useState()
        const handleReset = () => {
            setSelectedFaculty(undefined);
            setSelectedClassRoom(undefined);
            setSelectedSection(undefined);
        };

        window.addEventListener(SEARCH_QUERY_RESET, handleReset);

        return () => window.removeEventListener(SEARCH_QUERY_RESET, handleReset);
    }, [])

    return (
        <>
            <div className="space-y-2">
                <Label>Faculty</Label>
                <section>
                    <StaticCombobox
                        options={faculties?.map(faculty => ({ label: faculty.name, value: faculty.name })) ?? []}
                        placeholder="Select a faculty"
                        value={selectedFaculty?.name ?? ''}
                        onSelectChange={(val) => {
                            const faculty = faculties?.find((faculty) => faculty.name === val);

                            setSearchParams(FACULTY_SEARCH_KEY, val === 'reset' ? undefined : faculty?.id);
                            setSearchParams(classRoomKey, undefined);
                            setSearchParams(SECTION_SEARCH_KEY, undefined);
                            setSelectedClassRoom(undefined);

                            setSelectedFaculty(faculty);
                        }}
                        disabled={!faculties?.length || isLoading}
                    />
                </section>
                {/* <Select
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
                </Select> */}
            </div>

            <section className='relative space-y-2'>
                <Label>Class</Label>

                <div>
                    <StaticCombobox
                        options={selectedFaculty?.classRooms?.map(classRoom => ({ label: classRoom.name, value: classRoom.name })) ?? []}
                        placeholder="Select a class"
                        value={selectedClassRoom?.name ?? ''}
                        onSelectChange={(val) => {
                            const classRoom = selectedFaculty?.classRooms?.find((classRoom) => classRoom.name === val);

                            setSearchParams(classRoomKey, val === 'reset' ? undefined : classRoom?.id)
                            setSearchParams(SECTION_SEARCH_KEY, undefined)

                            setSelectedClassRoom(classRoom);
                        }}
                        disabled={
                            !selectedFaculty?.classRooms?.length
                            || isLoading
                        }
                    />
                </div>

                {/* <Select
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
                </Select> */}
            </section>

            {
                !onlyClassRoom && <section className='relative space-y-2'>
                    <Label>Section</Label>
                    <div>
                        <StaticCombobox
                            options={selectedClassRoom?.children?.map(section => ({ label: section.name, value: section.name })) ?? []}
                            placeholder="Select a section"
                            value={selectedSection?.name ?? ''}
                            onSelectChange={(val) => {
                                const section = selectedClassRoom?.children?.find((section) => section.name === val);
                                setSearchParams('sectionId', val === 'reset' ? undefined : section?.id)
                                setSelectedSection(section);
                            }}
                            disabled={
                                !selectedClassRoom?.children?.length
                                || isLoading
                            }
                        />
                    </div>

                    {/* <Select
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
                    </Select> */}
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