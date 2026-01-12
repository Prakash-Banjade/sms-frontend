import { PaginatedResponse, Role } from "@/types/global.type";

export enum EConversationType {
    DIRECT = 'DIRECT', // Student <-> Teacher
    GROUP = 'GROUP',   // Class-Subject Channel
}

export type TChatMessage = {
    id: string,
    content: string,
    createdAt: string,
    sender: {
        id: string,
        lowerCasedFullName: string,
        role: Role
    }
    participant: {
        id: string;
        unreadCount: number
    }[]
}

export type TChatMessagesResponse = PaginatedResponse<TChatMessage>;

export type TConversation = {
    id: string,
    type: EConversationType,
    title: string | null,
    lastMessageContent: string,
    lastMessageAt: string | null,
    participants: {
        id: string,
        unreadCount: number,
        account: {
            verifiedAt: string | null,
            id: string,
            lowerCasedFullName: string,
            role: Role,
            profileImage: {
                id: string,
                url: string
            } | null
        }
    }[]
}

export type TConversationResponse = PaginatedResponse<TConversation>;