import type { UUID } from "./global.js";
import type { User } from "./users.js";

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


export type { Friend, FriendRequest, Friendship };