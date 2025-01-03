import { Separator } from "@/components/ui/separator"
import { KeyRound } from "lucide-react"
import React from "react"
import { useGetWebAuthnCredentials } from "../../data-access/account-data-access"
import { formatDistanceToNow, isToday } from "date-fns"
import EditPassKeyBtn from "./edit-passkey-btn"
import DeletePassKeyBtn from "./delete-passkey-btn"

export default function PassKeysList() {
    const { data: credentials, isLoading } = useGetWebAuthnCredentials({})

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-px mt-6 border rounded-md overflow-hidden">
            {credentials?.map((cred, ind) => {
                const lastUsed = cred.lastUsed;
                let lastUsedString = lastUsed && (
                    isToday(new Date(lastUsed))
                        ? `${formatDistanceToNow(new Date(lastUsed))} ago`
                        : new Date(lastUsed).toDateString()
                );

                return (
                    <React.Fragment key={cred.id}>
                        <div className="flex items-center justify-between p-4 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                    <KeyRound className="size-6" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-medium ">
                                            {cred.name}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-zinc-500">
                                        Added on {new Date(cred.createdAt).toDateString()} | Last used {lastUsedString || 'Never'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <EditPassKeyBtn credentialId={cred.id} defaultName={cred.name} />
                                <DeletePassKeyBtn credentialId={cred.id} />
                            </div>
                        </div>

                        {
                            ind !== credentials?.length - 1 && (
                                <Separator />
                            )
                        }
                    </React.Fragment>
                )
            })}
        </div>
    )
}