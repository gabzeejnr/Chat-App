import type { UUID } from "node:crypto";

interface Messages {
    id: UUID;
    conversation_id: UUID;
    sender_id: UUID;
    content: string;
    created_at: string;
}

export type { Messages }