import { Button } from "@/components/ui/button";
import { cn, getImageUrl } from "@/lib/utils";
import { QueryKey } from "@/react-query/queryKeys";
import { useAxios } from "@/services/api";
import { createQueryString } from "@/utils/create-query-string";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, RefreshCcw } from "lucide-react";
import { Link, Outlet, useParams } from "react-router-dom";
import { TConversation } from "../../types/chat.types";
import { useAuth } from "@/contexts/auth-provider";
import { ProfileAvatar } from "@/components/ui/avatar";
import { formatDate } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import AddChatBtn from "../../components/chats/add-chat-btn";
import { Badge } from "@/components/ui/badge";

const DEFAULT_TAKE = 10;

export default function ChatLayout() {
    const { id: conversationId } = useParams();
    const axios = useAxios();
    const queryClient = useQueryClient();

    const {
        data,
        isLoading,
        refetch,
        isRefetching,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: [QueryKey.CONVERSATIONS],
        queryFn: async ({ pageParam = 1 }) => {
            const queryString = createQueryString({
                page: pageParam,
                take: DEFAULT_TAKE,
            });
            const response = await axios.get<any>(`/${QueryKey.CONVERSATIONS}?${queryString}`);
            return response.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
    });

    const chats = data?.pages.flatMap((page) => page.data) ?? [];

    return (
        <div
            className="relative flex"
            style={{
                height: 'calc(100% + 16px)'
            }}
        >
            <aside className="h-full border w-[400px] rounded-l-lg overflow-hidden">
                <header className="bg-secondary/20 border-b flex items-center justify-between p-4">
                    <section>
                        <h2 className="text-lg font-semibold">Chats</h2>
                        <p className="text-sm">Manage chats</p>
                    </section>
                    <section className="space-x-2">
                        <Button
                            onClick={() => {
                                // invalidate the conversations and currently opened chat messages
                                refetch();
                                queryClient.invalidateQueries({ queryKey: [QueryKey.CONVERSATION_MESSAGES, conversationId] });
                            }}
                            size={'icon'}
                            variant={'ghost'}
                            disabled={isRefetching}
                            aria-label="Refresh"
                        >
                            <RefreshCcw className={cn(isRefetching && "animate-spin")} />
                        </Button>
                        <AddChatBtn />
                    </section>
                </header>
                <RenderChats data={chats} isLoading={isLoading} conversationId={conversationId as string} />
                {
                    hasNextPage && !isFetchingNextPage && (
                        <div className="flex items-center justify-center mt-10">
                            <Button
                                aria-label="Load More"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage && <Loader2 className="animate-spin mr-2" />}
                                Load More
                            </Button>
                        </div>
                    )
                }
                {
                    isFetchingNextPage && (
                        <ConversationsLoading />
                    )
                }
            </aside>
            <section className="h-full flex-1 border border-l-0 rounded-r-lg overflow-hidden">
                <Outlet />
            </section>
        </div>
    )
}


function RenderChats({ data, isLoading, conversationId }: { data: TConversation[]; isLoading: boolean; conversationId: string }) {
    const { payload: user } = useAuth();

    if (isLoading) return <ConversationsLoading />;
    if (!data.length) return (
        <div className="px-6 py-20 text-center">No chats found</div>
    );

    return (
        <ul>
            {
                data.map((chat) => {
                    const otherParticipant = chat.participants.find((participant) => participant.account.id !== user?.accountId);
                    const currentParticipant = chat.participants.find((participant) => participant.account.id === user?.accountId);

                    return (
                        <li key={chat.id} className="border-b">
                            <Link
                                to={chat.id}
                                className={cn(
                                    "p-4 block hover:bg-accent/20",
                                    conversationId === chat.id && "bg-secondary hover:bg-secondary ring-primary/20 ring-1"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <ProfileAvatar
                                        src={getImageUrl(otherParticipant?.account.profileImage?.url, "w=56")}
                                        name={otherParticipant?.account.lowerCasedFullName ?? chat.title ?? ""}
                                        className="size-14"
                                    />
                                    <div className="flex-1">
                                        <header className="flex justify-between items-center gap-2">
                                            <p className={cn("capitalize font-medium", !currentParticipant?.unreadCount && "text-muted-foreground")}>{otherParticipant?.account.lowerCasedFullName}</p>
                                        </header>
                                        {
                                            chat.lastMessageAt && (
                                                <time className="text-xs text-muted-foreground">{formatDate(chat.lastMessageAt, 'PPpp')}</time>
                                            )
                                        }
                                    </div>
                                    {!!currentParticipant?.unreadCount && (
                                        <Badge>{currentParticipant.unreadCount > 9 ? "9+" : currentParticipant.unreadCount}</Badge>
                                    )}
                                </div>
                            </Link>
                        </li>
                    )
                })
            }
        </ul>
    )
}

function ConversationsLoading() {
    return (
        <ul>
            {Array.from({ length: 6 }).map((_, i) => (
                <li key={i} className="border-b p-4 py-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="size-14 rounded-full" />
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-5 w-[120px]" />
                            </div>
                            <Skeleton className="h-4 w-[100px]" />
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    )
}