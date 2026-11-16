import type { UUID } from "./global.js";

interface ClientMessage {
    id: UUID;
    conversationId: UUID;
    senderId: UUID | undefined;
    content: string;
    createdAt: string;
}


export type { ClientMessage }