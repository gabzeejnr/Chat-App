import type { User } from "./users.js";

interface Friendship {
    id: string;
    user_one_id: string;
    user_two_id: string;
    created_at: Date;
}

interface FriendRequest {
    id: string;
    senderId: string;
    receiverId: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
}

interface Friend extends Omit<User, "email"> {
    friendshipId: string;
}


export type { Friend, FriendRequest, Friendship };