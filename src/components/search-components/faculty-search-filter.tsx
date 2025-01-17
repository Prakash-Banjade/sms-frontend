import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "../ui/label";
import { TFacultyOption, useFacultySearch } from "@/hooks/useFacultySearch";

export default function FacultySearchFilters() {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const { data } = useFacultySearch();
    const [facultiesOptions, setFacultiesOptions] = useState<TFacultyOption[]>([]);

    useEffect(() => {
        if (data?.length) {
            const facultyId = searchParams.get('facultyId');

            if (facultyId) {
                const faculty = data.some(f => f.id === facultyId);

                if (!faculty) {
                    setSearchParams('facultyId', undefined);
                }
            }

            setFacultiesOptions(data);
        }
    }, [data]);

    return (
        <>
            <div className="space-y-2">
                <Label>Faculty</Label>
                <Select
                    value={searchParams.get('facultyId') ?? ''}
                    onValueChange={val => setSearchParams('facultyId', val === 'reset' ? undefined : val)}
                    disabled={!facultiesOptions?.length}
                >
                    <SelectTrigger className="min-w-[200px]">
                        <SelectValue placeholder="Select a faculty" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="reset" className="text-xs text-muted-foreground">Select a faculty</SelectItem>
                            {facultiesOptions?.map(faculty => (
                                <SelectItem key={faculty.id} value={faculty.id}>{faculty.name}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </>
    )
}