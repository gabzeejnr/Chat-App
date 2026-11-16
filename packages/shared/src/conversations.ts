import type { UUID } from "./global.js";

interface ClientMessage {
    id: UUID;
    conversationId: UUID;
    senderId: UUID | undefined;
    content: string;
    createdAt: string;
}

interface NewMessageEvent {
    friendshipId: UUID;
    message: ClientMessage;
}


export type { ClientMessage, NewMessageEvent }