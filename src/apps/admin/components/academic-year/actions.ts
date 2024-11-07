import { useFetchData } from "@/hooks/useFetchData"
import { QueryKey } from "@/react-query/queryKeys"
import { TAcademicYear, TAcademicYearsResponse } from "@/types/academic-year.type"
import { SelectOption } from "@/types/global.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetAcademicYear = ({
    id,
    queryString,
    options,
}: {
    id: string;
    queryString?: string;
    options?: UseQueryOptions<TAcademicYear>
}) => {
    const response = useFetchData<TAcademicYear>({
        queryKey: [QueryKey.ACADEMIC_YEARS, id],
        endpoint: QueryKey.ACADEMIC_YEARS,
        id,
        queryString,
        options,
    })

    return response;
}

export const useGetAcademicYears = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<TAcademicYearsResponse>
}) => {
    const response = useFetchData<TAcademicYearsResponse>({
        endpoint: QueryKey.ACADEMIC_YEARS,
        queryKey: queryString ? [QueryKey.ACADEMIC_YEARS, queryString] : [QueryKey.ACADEMIC_YEARS],
        queryString,
        options,
    })

    return response;
}

export const useGetAcademicYearOptions = ({
    queryString,
    options,
}: {
    queryString?: string;
    options?: UseQueryOptions<SelectOption[]>
}) => {
    const response = useFetchData<SelectOption[]>({
        endpoint: QueryKey.ACADEMIC_YEARS + '/' + QueryKey.OPTIONS,
        queryKey: queryString ? [QueryKey.ACADEMIC_YEARS, queryString] : [QueryKey.ACADEMIC_YEARS],
        queryString,
        options,
    })

    return response;
}

