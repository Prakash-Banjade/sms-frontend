import { useEffect, useState } from "react";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

type Props = {
    label?: string;
    placeholder?: string;
    searchKey?: string;
    className?: string;
}

export default function SearchInput({ label, placeholder, searchKey = "search", className }: Props) {
    const { searchParams, setSearchParams } = useCustomSearchParams();
    const [searchTerm, setSearchTerm] = useState<string>(searchParams.get(searchKey) || '');

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchParams(searchKey, searchTerm?.trim());
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    return !!label ? (
        <div className="space-y-2">
            <Label htmlFor="search">{label ?? "Search"}</Label>
            <section className="relative flex items-center">
                <Search className="absolute left-3 text-muted-foreground" size={16} />
                <Input
                    type="search"
                    placeholder={placeholder ?? "Search..."}
                    value={searchTerm}
                    onChange={handleInputChange}
                    className={cn("min-w-[300px] pl-9!", className)}
                />
            </section>
        </div>
    ) : (
        <section className="relative flex items-center">
            <Search className="absolute left-3 text-muted-foreground" size={16} />
            <Input
                type="search"
                placeholder={placeholder ?? "Search..."}
                value={searchTerm}
                onChange={handleInputChange}
                className={cn("min-w-[300px] pl-9!", className)}
            />
        </section>
    )
}