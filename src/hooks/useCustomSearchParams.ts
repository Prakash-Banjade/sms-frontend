import { useSearchParams } from "react-router-dom";

export function useCustomSearchParams() {
    const [params, setParams] = useSearchParams();

    const setSearchParams = (key: string, value: string | undefined) => {
        if (value) {
            params.set(key, value);
            setParams(params);
        } else {
            params.delete(key);
            setParams(params);
        }
    }

    return {
        searchParams: params,
        setSearchParams,
    }
}