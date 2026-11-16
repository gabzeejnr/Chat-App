import type { UUID } from "./global.js";

interface User {
    userId: UUID;
    username: string;
    displayName: string;
    email: string;
    avatarUrl: string;
}

interface DiscoverableUser extends User {
    hasOutgoingRequest: boolean;
    hasIncomingRequest: boolean;
}


export type { DiscoverableUser, User };