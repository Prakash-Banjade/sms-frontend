import { useEffect, useState } from "react";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type Props = {
    label?: string;
    placeholder?: string;
}

export default function SearchInput({ label, placeholder }: Props) {
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>(searchParams.get('search') || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchParams('search', searchTerm);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm, setSearchParams, searchParams]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="search">{label ?? "Search"}</Label>
            <Input
                type="search"
                placeholder={placeholder ?? "Search..."}
                value={searchTerm}
                onChange={handleInputChange}
                className="min-w-[300px]"
            />
        </div>
    )
}