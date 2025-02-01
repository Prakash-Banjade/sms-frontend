import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
    SidebarGroup,
    SidebarGroupContent,
    useSidebar,
} from "@/components/ui/sidebar"
import { useRef, useState } from "react";
import { Input } from "../ui/input";

export function SidebarSearchForm() {
    const { search, setSearch } = useSidebar();
    const [inputVal, setInputVal] = useState(search);
    const inputRef = useRef<HTMLInputElement>(null);

    const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const search = e.currentTarget.search.value;

        setSearch(search || "");
    }

    return (
        <form onSubmit={onSearchSubmit}>
            <SidebarGroup className="p-0">
                <SidebarGroupContent className="relative">
                    <Label htmlFor="search" className="sr-only">
                        Search
                    </Label>
                    <Input
                        ref={inputRef}
                        value={inputVal}
                        onChange={(e) => setInputVal(prev => {
                            const val = e.target.value;

                            if (prev !== "" && val === "") { // auto reset if user clears input event if form is not submitted
                                setSearch("");
                            }

                            return val;
                        })}
                        type="search"
                        id="search"
                        placeholder="Search menu..."
                        className="pl-8"
                    />
                    <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                </SidebarGroupContent>
            </SidebarGroup>
        </form>
    )
}

