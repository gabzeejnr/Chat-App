import type { ClientMessage, UUID } from "@chat-app/shared";

interface ChatInputProps {
    username: string;
    sendingMessage: boolean;
    onSend?: (message: string) => Promise<void>;
}

interface MessagesAreaProps {
    messages: ClientMessage[];
    friendshipId: UUID;
    userId: UUID | undefined;
}

export type { ChatInputProps, MessagesAreaProps }