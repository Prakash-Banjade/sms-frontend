"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import React, { startTransition, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { formatDate, isSameYear, isToday } from 'date-fns';
import { ProfileAvatar } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { InfiniteData, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { TAuthPayload, useAuth } from '@/contexts/auth-provider';
import { chatDefaultValues, chatSchema, TChatSchema } from '../../schemas/chat.schema';
import { TChatMessage, TChatMessagesResponse, TConversation, TConversationResponse } from '../../types/chat.types';
import { QueryKey } from '@/react-query/queryKeys';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from '@/components/ui/input-group';
import { useAppMutation } from '@/hooks/useAppMutation';
import { useFetchData } from '@/hooks/useFetchData';
import { useAxios } from '@/services/api';
import { createQueryString } from '@/utils/create-query-string';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export default function SingleChatPage() {
    const { id: conversationId } = useParams();
    const { payload: user } = useAuth();
    const queryClient = useQueryClient();
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const form = useForm<TChatSchema>({
        resolver: zodResolver(chatSchema),
        defaultValues: {
            ...chatDefaultValues,
            conversationId,
        },
    });

    const { mutateAsync: send, isPending: isSending } = useAppMutation();

    const { data: conversation, isLoading: isConversationLoading } = useFetchData<TConversation>({
        endpoint: `${QueryKey.CONVERSATIONS}/${conversationId}`,
        queryKey: [QueryKey.CONVERSATIONS, conversationId!],
    });

    function onSubmit(data: TChatSchema) {
        if (!user) return;

        const newMessage: TChatMessage = {
            id: crypto.randomUUID(),
            content: data.content,
            createdAt: new Date().toISOString(),
            sender: {
                id: user.accountId,
                lowerCasedFullName: user.firstName.toLowerCase() + ' ' + user.lastName.toLowerCase(),
                role: user.role,
            },
        };

        // Optimistic update
        queryClient.setQueryData<InfiniteData<TChatMessagesResponse>>(
            [QueryKey.CONVERSATION_MESSAGES, conversationId],
            (oldData) => {
                if (!oldData) {
                    return {
                        pages: [{
                            data: [newMessage],
                            meta: {
                                hasNextPage: false, hasPreviousPage: false, itemCount: 1, page: 1, pageCount: 1, take: 10
                            }
                        }],
                        pageParams: [1]
                    } as InfiniteData<TChatMessagesResponse>;
                }

                const newPages = [...oldData.pages];
                if (newPages.length > 0) {
                    newPages[0] = {
                        ...newPages[0],
                        data: [newMessage, ...newPages[0].data]
                    };
                }
                return {
                    ...oldData,
                    pages: newPages,
                };
            }
        );

        form.reset({
            ...chatDefaultValues,
            conversationId: data.conversationId,
        });

        textareaRef.current?.focus();

        send({
            endpoint: `${QueryKey.CONVERSATION_MESSAGES}`,
            method: 'post',
            data,
            toastOnSuccess: false,
            onError: () => {
                // rollback optimistic update
                queryClient.setQueryData<InfiniteData<TChatMessagesResponse>>(
                    [QueryKey.CONVERSATION_MESSAGES, conversationId],
                    (oldData) => {
                        if (!oldData || !oldData.pages.length) return oldData;
                        const newPages = [...oldData.pages];
                        // Remove the optimistically added message (first item of first page)
                        newPages[0] = {
                            ...newPages[0],
                            data: newPages[0].data.slice(1)
                        };
                        return { ...oldData, pages: newPages };
                    }
                );
            },
        });
    }

    if (!user) return null;

    return (
        <div className='bg-card flex flex-col h-full'>
            <ChatHeader
                data={conversation}
                isLoading={isConversationLoading}
                user={user}
            />

            <section className='flex-1'>
                {
                    isConversationLoading ? (
                        <div className='h-full p-2'>
                            <Skeleton className='h-full' />
                        </div>
                    ) : (
                        <RenderMessages
                            user={user}
                            conversation={conversation}
                        />
                    )
                }
            </section>

            <section className='mt-auto mb-2 mx-2'>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
                    <InputGroup>
                        <InputGroupTextarea
                            ref={textareaRef}
                            placeholder="Type your message here..."
                            minLength={1}
                            maxLength={500}
                            className="max-h-80 field-sizing-content focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-offset-0"
                            value={form.watch("content")}
                            onChange={(e) => form.setValue("content", e.target.value)}
                            onKeyDown={e => {
                                // if ctrl + enter, submit form
                                if (e.key === 'Enter' && e.ctrlKey) {
                                    e.preventDefault();
                                    form.handleSubmit(onSubmit)();
                                }
                            }}
                        />
                        <InputGroupAddon align="block-end">
                            <InputGroupButton
                                type='submit'
                                variant="default"
                                className="size-8 ml-auto"
                                disabled={isSending}
                            >
                                {
                                    isSending ? (
                                        <Spinner />
                                    ) : (
                                        <>
                                            <Send size={20} />
                                            <span className="sr-only">Send</span>
                                        </>
                                    )
                                }
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </form>
            </section>
        </div>
    )
}

function ChatHeader({
    data,
    isLoading,
    user
}: {
    isLoading: boolean,
    data: TConversation | undefined
    user: TAuthPayload
}) {
    if (isLoading) return (
        <ChatHeaderSkeleton />
    );

    if (!data) return null;

    const otherParticipant = data.participants.find(participant => participant.account.id !== user?.accountId);

    return (
        <header className='bg-secondary/20 p-4 flex items-center gap-6 border-b'>
            <ProfileAvatar
                src={otherParticipant?.account.profileImage?.url}
                name={otherParticipant?.account.lowerCasedFullName ?? data.title ?? ""}
                className="size-12"
            />
            <section>
                <h2 className="font-semibold capitalize">{otherParticipant?.account.lowerCasedFullName ?? data.title ?? ""}</h2>
                {/* <p className="text-sm">{otherParticipant?.account.organization.name}</p> */}
            </section>
        </header>
    )
}

function ChatHeaderSkeleton() {
    return (
        <header className='bg-secondary/10 p-4 flex items-center gap-6'>
            <Skeleton className="size-12 rounded-full" />
            <section className='flex-1 space-y-2'>
                <Skeleton className="h-5 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
            </section>
        </header>
    )
}

const DEFAULT_TAKE = 30;

function RenderMessages({
    user,
    conversation
}: {
    user: TAuthPayload
    conversation: TConversation | undefined
}) {
    const queryClient = useQueryClient();
    const axios = useAxios();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: [QueryKey.CONVERSATION_MESSAGES, conversation?.id],
        queryFn: async ({ pageParam = 1 }) => {
            const queryString = createQueryString({
                take: DEFAULT_TAKE,
                page: pageParam
            });
            const response = await axios.get<TChatMessagesResponse>(`/${QueryKey.CONVERSATION_MESSAGES}/${conversation?.id}?${queryString}`);
            return response.data;
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            return lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined;
        },
        enabled: !!conversation?.id
    });

    const messages = data?.pages.flatMap((page) => page.data).slice().reverse() ?? [];

    const lastMarkedSeenIdRef = useRef<string | null>(null);

    const { mutateAsync: markSeen } = useAppMutation();

    // mark as read
    useEffect(() => {
        if (data?.pages[0]?.data.length && conversation) {
            // mark latest message as seen (first item in first page)
            const latestMessage = data.pages[0].data[0];
            const lastMessageId = latestMessage?.id;

            const currentParticipant = conversation.participants.find(participant => participant.account.id === user.accountId);

            if (lastMessageId && !currentParticipant?.unreadCount && latestMessage.sender.id !== user.accountId && lastMarkedSeenIdRef.current !== lastMessageId) {
                lastMarkedSeenIdRef.current = lastMessageId;
                startTransition(() => {
                    markSeen({
                        endpoint: `${QueryKey.CONVERSATIONS}/${conversation.id}/mark-as-read`,
                        method: 'post',
                        toastOnError: false,
                        toastOnSuccess: false,
                    });
                })

                // update the corresponding conversation participant unreadCount on the side
                queryClient.setQueryData([QueryKey.CONVERSATIONS], (oldData: InfiniteData<TConversationResponse, unknown> | undefined) => {
                    if (!oldData) return oldData;

                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => {
                            return {
                                ...page,
                                data: page.data.map((item) => {
                                    if (item.id === conversation.id && item.participants.find(participant => participant.account.id === user.accountId)?.unreadCount) {
                                        return {
                                            ...item,
                                            participants: item.participants.map((participant) => {
                                                if (participant.account.id === user.accountId) {
                                                    return {
                                                        ...participant,
                                                        unreadCount: 0,
                                                    }
                                                }
                                                return participant;
                                            })
                                        }
                                    }
                                    return item;
                                })
                            }
                        })
                    }
                });
            }
        }
    }, [data, conversation, queryClient, markSeen, user.accountId]);

    // Handle scroll to load more
    useEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const handleScroll = () => {
            if (viewport.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
                setPrevScrollHeight(viewport.scrollHeight);
                fetchNextPage();
            }
        };

        viewport.addEventListener('scroll', handleScroll);
        return () => viewport.removeEventListener('scroll', handleScroll);
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Restore scroll position after loading more
    React.useLayoutEffect(() => {
        const viewport = viewportRef.current;
        if (prevScrollHeight > 0 && viewport) {
            const newScrollHeight = viewport.scrollHeight;
            const scrollDiff = newScrollHeight - prevScrollHeight;
            viewport.scrollTop = scrollDiff;
            setPrevScrollHeight(0);
        }
    }, [messages, prevScrollHeight]);

    // Track the last message ID to detect if we received a NEW message (at the bottom)
    const lastMessageRef = useRef<string | null>(null);

    // Initial scroll to bottom
    useEffect(() => {
        if (messages.length > 0 && !lastMessageRef.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
            lastMessageRef.current = messages[messages.length - 1].id;
        }
    }, [messages]);

    // Scroll to bottom ONLY when a NEW message is added (tail of the list)
    useEffect(() => {
        if (messages.length === 0) return;

        const currentLastMessageId = messages[messages.length - 1].id;

        // If the last message ID has changed, it means we have a new message at the bottom.
        // We do NOT want to scroll if we just loaded older messages (which changes messages array but NOT the last message ID usually, unless it was empty before)
        if (lastMessageRef.current && lastMessageRef.current !== currentLastMessageId) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }

        lastMessageRef.current = currentLastMessageId;
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto bg-card h-full">
            <ScrollArea
                className='p-4'
                style={{
                    height: `100%`,
                    maxHeight: `calc(100vh - 340px)`,
                }}
                ref={viewportRef}
            >
                {isLoading ? (
                    <div className="py-20 flex items-center justify-center">
                        <Spinner />
                    </div>
                ) : (
                    <div className="space-y-3">
                        {isFetchingNextPage && (
                            <div className="flex justify-center py-2">
                                <Spinner className="size-4" />
                            </div>
                        )}

                        {messages.length === 0 ? (
                            <div className="text-center text-muted-foreground mt-8">
                                <p>Start a conversation by typing your message!</p>
                            </div>
                        ) : (
                            messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={cn(`flex`, message.sender.id === user?.accountId ? 'justify-end' : 'justify-start')}
                                >
                                    <div className='max-w-[80%]'>
                                        <div
                                            className={cn(
                                                `px-4 py-2`,
                                                message.sender.id === user?.accountId
                                                    ? 'bg-blue-600 text-white rounded-xl rounded-tr-none'
                                                    : 'bg-secondary rounded-xl rounded-tl-none'
                                            )}
                                        >
                                            <p className="whitespace-pre-wrap">{message.content}</p>
                                        </div>
                                        <span className={cn("text-xs opacity-70 mt-1 block", message.sender.id === user.accountId ? 'text-right' : 'text-left')}>
                                            {
                                                isToday(message.createdAt)
                                                    ? formatDate(message.createdAt, 'h:mm a')
                                                    : isSameYear(message.createdAt, new Date())
                                                        ? formatDate(message.createdAt, 'MMM d, h:mm a')
                                                        : formatDate(message.createdAt, 'MMM d, yyyy h:mm a')
                                            }
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}