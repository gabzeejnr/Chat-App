import type { ClientMessage } from "./conversations.js";
import type { UUID } from "./global.js";
import type { User } from "./users.js";

type LastMessage = Omit<ClientMessage, "conversationId">

interface Friendship {
    id: UUID;
    user_one_id: UUID;
    user_two_id: UUID;
    created_at: Date;
}

interface FriendRequest {
    id: UUID;
    senderId: UUID;
    receiverId: UUID;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
}

interface Friend extends Omit<User, "email"> {
    friendshipId: UUID;
}

interface ChatFriend extends Friend {
    lastMessage: LastMessage | null;
}


export type { ChatFriend, Friend, FriendRequest, Friendship };