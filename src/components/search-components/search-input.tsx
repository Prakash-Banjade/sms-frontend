import { useSearchParams } from "react-router-dom";
import { AppFormText } from "../forms/app-form-text"
import { useCallback } from "react";
import { debounce } from "@/utils/debounce";

type Props = {
    label?: string;
    placeholder?: string;
    containerClassName?: string;
}

export default function SearchInput({ label, placeholder, containerClassName }: Props) {
    const [searchParams, setSearchParams] = useSearchParams();

    const handleInputChange = useCallback(
        debounce((event: React.ChangeEvent<HTMLInputElement>) => {
            const { value, name } = event.target;

            if (!!value) {
                searchParams.set(name, value);
                setSearchParams(searchParams);
            } else {
                searchParams.delete(name);
                setSearchParams(searchParams);
            }
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
        />
    )
}