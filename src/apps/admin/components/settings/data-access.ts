import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { UseQueryOptions } from "@tanstack/react-query";

export type TGeneralSetting = {
    id: string,
    updatedAt: string,
    libraryFine?: number;
}

export const useGetGeneralSettings = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TGeneralSetting>
}) => {
    const response = useFetchData<TGeneralSetting>({
        endpoint: QueryKey.GENERAL_SETTINGS,
        queryKey: queryString ? [QueryKey.GENERAL_SETTINGS, queryString] : [QueryKey.GENERAL_SETTINGS],
        queryString,
        options,
    })

    return response;
}