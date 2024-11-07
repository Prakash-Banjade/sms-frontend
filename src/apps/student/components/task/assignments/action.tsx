// export const useTasks = ({
//     queryString,
//     options,
// }: {
//     queryString?: string;
//     options?: UseQueryOptions<TTasksResponse>
// }) => {
//     const response = useFetchData<TTasksResponse>({
//         endpoint: QueryKey.ATTENDANCES,
//         queryKey: queryString ? [QueryKey.ATTENDANCES, queryString] : [QueryKey.ATTENDANCES],
//         queryString,
//         options,
//     })

//     return response;
// }