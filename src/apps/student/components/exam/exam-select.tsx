
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TExamType } from "@/apps/admin/types/examination.type";

interface ExamTypeSelectProps {
    data: TExamType[];
    placeholder: string,
    label: string,
    onSelectChange: (val: string) => void
}

const ExamTypeSelect = ({ data, placeholder, label, onSelectChange }: ExamTypeSelectProps) => {
    const [searchParams, setSearchParams] = useSearchParams();

    // Initialize the selected ExamType number from URL, if it exists
    const initialExamTypeNumber = searchParams.get("search") || '';
    const [selectedExamType, setSelectedExamType] = useState<string>(initialExamTypeNumber);

    // Update the URL when the selected ExamType changes
    useEffect(() => {
        if (selectedExamType) {
            setSearchParams({ search: selectedExamType });
        }
    }, [selectedExamType, setSearchParams]);

    // Handle select change to update the selected ExamType and URL
    const handleSelectChange = (value: string) => {
        setSelectedExamType(value);
        onSelectChange(value)
    };

    return (
        <div>
            <Select value={selectedExamType} onValueChange={handleSelectChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>{label}</SelectLabel>
                        {data.map((ExamType) => (
                            <SelectItem key={ExamType.name} value={ExamType.name}>
                                {ExamType.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
};

export default ExamTypeSelect;
