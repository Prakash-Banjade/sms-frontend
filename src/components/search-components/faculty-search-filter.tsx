import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "../ui/label";
import { useFacultySearch } from "@/hooks/useFacultySearch";
import { EDegreeLevel } from "@/types/global.type";
import { EDegreeLevelMappings } from "@/utils/labelToValueMappings";

type TFacultyOption = {
    id: string;
    name: string;
    degreeLevel: EDegreeLevel;
}

export default function FacultySearchFilters() {
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const [schoolLevelFacultyId, setSchoolLevelFacultyId] = useState('');

    const { data } = useFacultySearch<TFacultyOption>();
    const [facultiesOptions, setFacultiesOptions] = useState<TFacultyOption[]>([]);

    useEffect(() => {
        if (data?.length) {
            const facultyId = searchParams.get('facultyId');

            if (facultyId) {
                const faculty = data.find(f => f.id === facultyId);

                if (!faculty) {
                    setSearchParams('facultyId', undefined);
                }

                const degreeLevel = faculty?.degreeLevel ?? '';
                setSearchParams('degreeLevel', degreeLevel);
                setFacultiesOptions(data.filter(f => degreeLevel ? f.degreeLevel === degreeLevel : true));
            }

            const schoolLevel = data.find(f => f.degreeLevel === EDegreeLevel.Basic_School);
            if (schoolLevel) {
                setSchoolLevelFacultyId(schoolLevel.id);
            }
        }
    }, [data]);

    return (
        <>
            <div className="space-y-2">
                <Label>Level</Label>
                <Select
                    value={searchParams.get('degreeLevel') ?? ''}
                    onValueChange={val => {
                        setSearchParams('degreeLevel', val === 'reset' ? '' : val)
                        setSearchParams('facultyId', val === EDegreeLevel.Basic_School ? schoolLevelFacultyId : undefined) // for basic_school automatically set the faculty
                        setFacultiesOptions(data?.filter(f => f.degreeLevel === val) ?? [])
                    }}
                >
                    <SelectTrigger className="min-w-[200px]">
                        <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="reset" className="text-xs text-muted-foreground">Select level</SelectItem>
                            {
                                Object.entries(EDegreeLevel).map(([key, value]) => (
                                    <SelectItem key={key} value={value}>
                                        {EDegreeLevelMappings[value]}
                                    </SelectItem>
                                ))
                            }
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Faculty</Label>
                <Select
                    value={searchParams.get('facultyId') ?? ''}
                    onValueChange={val => setSearchParams('facultyId', val === 'reset' ? undefined : val)}
                    disabled={
                        searchParams.get('degreeLevel') === EDegreeLevel.Basic_School
                        || !facultiesOptions?.length
                    }
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