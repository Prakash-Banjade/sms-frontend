import { AppFormText } from "../forms/app-form-text"
import { useCallback } from "react";
import { debounce } from "@/utils/debounce";
import { useCustomSearchParams } from "@/hooks/useCustomSearchParams";

type Props = {
    label?: string;
    placeholder?: string;
    containerClassName?: string;
}

export default function SearchInput({ label, placeholder, containerClassName }: Props) {
    const { searchParams, setSearchParams } = useCustomSearchParams();

    const handleInputChange = useCallback(
        debounce((event: React.ChangeEvent<HTMLInputElement>) => {
            const { value, name } = event.target;

            setSearchParams(name, value);
        }, 500),
        [searchParams, setSearchParams]
    );

    return (
        <AppFormText
            name="search"
            label={label ?? "Search"}
            placeholder={placeholder ?? "Search..."}
            containerClassName={containerClassName}
            defaultValue={searchParams.get("search") ?? ''}
            onChange={handleInputChange}
            type="search"
        />
    )
}