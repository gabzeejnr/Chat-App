interface User {
    userId: string;
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