import { QueryKey } from "@/react-query/queryKeys";
import { useFetchData } from "./useFetchData";
import { TClassRoomOptions } from "@/types/class.type";

export type TFacultyOption = {
    id: string;
    name: string;
    classRooms?: TClassRoomOptions
}

export const useFacultySearch = (queryString?: string) => {
    const { data, isLoading } = useFetchData<TFacultyOption[]>({
        endpoint: QueryKey.FACULTIES + '/' + QueryKey.OPTIONS,
        queryKey: queryString ? [QueryKey.FACULTIES, QueryKey.OPTIONS, queryString] : [QueryKey.FACULTIES, QueryKey.OPTIONS],
        queryString,
        options: {
            staleTime: Infinity,
            gcTime: Infinity,
        }
    });

    /**
     * @param {string} facultyId
     * @description Checks if a faculty contains any classroom
     * @returns {boolean}
     */
    const hasClassRoom = (facultyId: string): boolean => {
        return !!data?.find(f => f.id === facultyId)?.classRooms?.length;
    };

    /**
     * @param {string} classRoomId
     * @description Checks if a classroom contains any section
     * @returns {boolean}
     */
    const hasSection = (classRoomId: string): boolean => {
        return !!data?.find(f => f.classRooms?.some(c => c.id === classRoomId))?.classRooms?.find(c => c.id === classRoomId)?.children?.length;
    }

    /**
     * @param {string} classRoomId
     * @description Returns the faculty id the classRoomId belongs to
     * @returns {string | undefined}
     */
    const getFacultyIdByClassRoomId = (classRoomId: string): string | undefined => {
        return data?.find(f => f.classRooms?.some(c => c.id === classRoomId))?.id;
    };

    return { data, isLoading, hasClassRoom, hasSection, getFacultyIdByClassRoomId };
};