import type { ClientMessage, UUID, Friend } from "@chat-app/shared";

interface ChatListProps {
    friend: Friend;
    isSelected: boolean;
    lastMessage: string | undefined;
    onSelectFriend: (friend: Friend) => void;
}

interface ChatInputProps {
    username: string;
    sendingMessage: boolean;
    onSend?: ((message: string) => Promise<void>) | undefined;
}

interface MessagesAreaProps {
    messages: ClientMessage[];
    friendshipId: UUID;
    userId: UUID | undefined;
}

interface ChatAreaProps {
    friend: Friend;
    onSend?: ((message: string) => Promise<void>) | undefined;
    onBack: () => void;
}

export type { ChatAreaProps, ChatInputProps, ChatListProps, MessagesAreaProps }