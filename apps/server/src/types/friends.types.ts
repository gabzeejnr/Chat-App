import type { UUID } from "node:crypto";
type FriendrequestStatus = "pending" | "accepted" | "rejected"

interface DatabaseFriendship {
    id: UUID;
    user_one_id: UUID;
    user_two_id: UUID;
    created_at: Date;
}

interface FriendRequest {
    id: UUID;
    sender_id: UUID;
    receiver_id: UUID;
    status: FriendrequestStatus;
    created_at: Date;
    updated_at: Date;
}

interface GetFriendRequests extends Omit<FriendRequest, "updated_at"> {
    username: string;
    display_name: string;
    avatar_url: string;
}

interface FriendRow {
    friendship_id: UUID;
    user_id: UUID;
    username: string;
    display_name: string;
    avatar_url: string;
}

export type { DatabaseFriendship, FriendRequest, FriendRow, GetFriendRequests }