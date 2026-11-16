import type { UUID } from "./global.js";

interface ClientMessage {
    id: UUID;
    conversationId: UUID;
    senderId: UUID;
    content: string;
    createdAt: string;
}


export type { ClientMessage }