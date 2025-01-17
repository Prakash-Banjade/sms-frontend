import { useFormContext } from 'react-hook-form'
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createQueryString } from '@/utils/create-query-string';
import { TFacultyOption, useFacultySearch } from '@/hooks/useFacultySearch';
import { TClassRoomOptions } from '@/types/class.type';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const FACULTY_ID = 'facultyId';
const CLASS_ROOM_ID = 'classRoomId';
const SECTION_ID = 'sectionId';
const SECTION_IDS = 'sectionIds';

type TRequiredFields = typeof FACULTY_ID | typeof CLASS_ROOM_ID | typeof SECTION_ID | typeof SECTION_IDS;

type Props = {
    include?: 'classRoom' | 'section';
    required?: Partial<Record<TRequiredFields, boolean>>;
}

export default function ClassSelectionFormField({
    include = 'classRoom',
    required
}: Props) {
    const form = useFormContext();

    const [selectedFaculty, setSelectedFaculty] = useState<TFacultyOption>();
    const [selectedClassRoom, setSelectedClassRoom] = useState<TClassRoomOptions[0]>();

    const { data: faculties, isLoading } = useFacultySearch(createQueryString({ include }));

    useEffect(() => {
        if (!faculties) return;

        const facultyId = form.getValues(FACULTY_ID);

        if (facultyId) {
            const faculty = faculties.find((faculty) => faculty.id === facultyId);
            if (!faculty) {
                form.setValue(FACULTY_ID, "")
            } else {
                setSelectedFaculty(faculty);
            }
        }

        const classRoomId = form.getValues(CLASS_ROOM_ID);

        if (classRoomId) {
            const classRoom = faculties?.find(f => f.classRooms?.find(c => c.id === classRoomId))?.classRooms?.find(c => c.id === classRoomId);
            if (!classRoom) {
                form.setValue(CLASS_ROOM_ID, "")
            } else {
                setSelectedClassRoom(classRoom);
            }
        }

        const sectionId = form.getValues(SECTION_ID);

        if (sectionId) {
            const section = faculties?.find(f => f.classRooms?.some(c => c.id === classRoomId))?.classRooms?.find(c => c.id === classRoomId)?.children?.some(ch => ch.id === sectionId);
            if (!section) {
                form.setValue(SECTION_ID, "")
            }
        }
    }, [faculties])

    return (
        <>
            <FormField
                control={form.control}
                name={FACULTY_ID}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Faculty</FormLabel>
                        {required?.facultyId && <RequiredAsterisk />}
                        <Select
                            value={field.value ?? ''}
                            onValueChange={val => {
                                field.onChange(val === 'reset' ? "" : val)
                                form.setValue(CLASS_ROOM_ID, "");
                                form.setValue(SECTION_ID, "");

                                const faculty = faculties?.find((faculty) => faculty.id === val);
                                setSelectedFaculty(faculty);
                            }}
                            required={required?.facultyId}
                            disabled={!faculties?.length}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select a faculty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        !required?.facultyId && (
                                            <SelectItem value="reset" className="text-xs text-muted-foreground">Select a faculty</SelectItem>
                                        )
                                    }
                                    {faculties?.map(faculty => (
                                        <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormDescription>Select the faculty</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name={CLASS_ROOM_ID}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Class</FormLabel>
                        {required?.classRoomId && <RequiredAsterisk />}
                        <Select
                            value={field.value ?? ''}
                            onValueChange={val => {
                                field.onChange(val === 'reset' ? "" : val)
                                form.setValue(SECTION_ID, "");

                                const classRoom = selectedFaculty?.classRooms?.find((classRoom) => classRoom.id === val);
                                setSelectedClassRoom(classRoom);
                            }}
                            disabled={
                                !selectedFaculty?.classRooms?.length
                                || isLoading
                            }
                            required={required?.classRoomId}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select a class" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {
                                        !required?.classRoomId && (
                                            <SelectItem value="reset" className='text-xs text-muted-foreground'>Select Class</SelectItem>
                                        )
                                    }
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
                        <FormDescription>Select the class room</FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {
                include === 'section' && (
                    <FormField
                        control={form.control}
                        name={SECTION_ID}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Section</FormLabel>
                                {required?.sectionId && <RequiredAsterisk />}
                                <Select
                                    value={field.value ?? ''}
                                    onValueChange={val => {
                                        field.onChange(val === 'reset' ? "" : val)
                                    }}
                                    disabled={
                                        !selectedFaculty?.classRooms?.length
                                        || isLoading
                                    }
                                    required={required?.sectionId}
                                >
                                    <SelectTrigger className="">
                                        <SelectValue placeholder="Select a section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                !required?.sectionId && (
                                                    <SelectItem value="reset" className='text-xs text-muted-foreground'>Select Section</SelectItem>
                                                )
                                            }
                                            {
                                                selectedClassRoom?.children?.map((section) => (
                                                    <SelectItem value={section.id} key={section.id}>{section.name}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormDescription>Select the class room</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )
            }
        </>
    )
}

function RequiredAsterisk() {
    return (
        <span className='text-red-500'>*</span>
    )
}