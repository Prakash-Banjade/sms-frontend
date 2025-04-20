import { useFetchData } from "@/hooks/useFetchData";
import { QueryKey } from "@/react-query/queryKeys";
import { TWebAuthnCredential } from "@/apps/admin/types/account/account.type";
import { UseQueryOptions } from "@tanstack/react-query";

export const useGetWebAuthnCredentials = ({
    options,
}: {
    options?: Partial<UseQueryOptions<TWebAuthnCredential[]>>
}) => {
    const response = useFetchData<TWebAuthnCredential[]>({
        queryKey: [QueryKey.WEB_AUTHN],
        endpoint: QueryKey.WEB_AUTHN,
        options,
    });

    return response;
}