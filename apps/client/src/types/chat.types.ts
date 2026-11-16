interface ChatInputProps {
    username: string;
    sendingMessage: boolean;
    onSend?: (message: string) => Promise<void>;
}

export type { ChatInputProps }