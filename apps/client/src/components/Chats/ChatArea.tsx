import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import { API, axios } from "../../apis/axios";
import { ArrowLeft, SendHorizontal, Check, Clock3 } from "../../libs";
import { toTime } from "../../utils";
import type { SubmitEvent, KeyboardEvent } from "react";
import type { Friend, ClientMessage } from "@chat-app/shared";
import type { ChatInputProps } from "../../types";
import styles from "./Chats.module.scss";

function ChatInput({ username, sendingMessage, onSend }: ChatInputProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const canSend = value.trim().length > 0;

    useLayoutEffect(function () {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    async function send() {
        if (!canSend || sendingMessage) return;
        try {
            await onSend?.(value.trim()); setValue("");
        } catch (err) {
            console.error("I'll put something here later:", err);
        }
    };

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        send();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    return (
        <form onSubmit={handleSubmit}
            className="absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-full items-end gap-2 rounded-3xl border border-border bg-surface px-3 py-2 shadow-md"
        >
            <textarea ref={textareaRef} rows={1} value={value} disabled={sendingMessage} placeholder={`Chat with ${username}`}
                onKeyDown={handleKeyDown} onChange={e => setValue(e.target.value)}
                className="max-h-40 min-h-9 flex-1 resize-none overflow-y-auto bg-transparent py-2 text-foreground outline-none placeholder:text-muted"
            />
            <button type="submit" disabled={!canSend || sendingMessage} aria-label={sendingMessage ? "Sending message" : "Send message"}
                className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-opacity duration-150 disabled:opacity-40"
            >
                <SendHorizontal className="size-4" />
            </button>
        </form>
    )
}

function MessagesArea({ messages, friendshipId, sendingMessage, userId }: {
    messages: ClientMessage[];
    friendshipId: Friend["userId"];
    sendingMessage: boolean;
    userId: Friend["userId"] | undefined
}) {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const size = 10;

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages.length, friendshipId])

    return (
        <div className={`${styles.wrapper} h-full mb-15 overflow-y-auto scrollbar-thumb-expand`}>
            {messages.map((message) => (
                <div key={message.id}
                    className={`${message.senderId === userId ? styles.user : styles.friend}
                    flex gap-1 py-2 px-4 mt-4 w-fit rounded-[20px] max-w-3/4 wrap-break-word relative`}
                >
                    <span>{message.content}</span>
                    <span className="self-end-safe flex items-end">
                        <span className="text-[8px]">{toTime(message.createdAt)}</span>
                        {sendingMessage ?
                            <Clock3 size={size} />
                            : <Check size={size} />
                        }
                    </span>
                </div>
            ))}
            <div ref={bottomRef} />
        </div>
    )
}

export default function ChatArea({ friend, onBack }: { friend: Friend; onBack: () => void }) {
    const { user } = useUser();
    const { username, friendshipId } = friend;
    const [messages, setMessages] = useState<ClientMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messagesError, setMessagesError] = useState<string | null>(null);
    const [sendingMessage, setSendingMessage] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        async function loadMessages() {
            try {
                setMessages([]);
                setMessagesError(null);
                setLoadingMessages(true);

                const { data } = await API.get<{ message: string; data: ClientMessage[] }>("/test/messages", {
                    signal: controller.signal
                });
                setMessages(data.data);
            } catch (err) {
                if (!controller.signal.aborted) {
                    const message = axios.isAxiosError<{ error?: string }>(err)
                        ? err.response?.data.error || "Couldn't load messages. Please try again."
                        : "Couldn't load messages. Please try again.";
                    setMessagesError(message);
                }
            } finally {
                if (!controller.signal.aborted) setLoadingMessages(false);
            }
        }

        void loadMessages();
        return () => controller.abort();
    }, [friendshipId]);

    async function handleSend(e: string) {
        setSendingMessage(true);
        try {
            await API.post("/test/send-message", { content: e })
            setSendingMessage(false);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    return (
        <section className="flex h-full min-h-0 flex-col overflow-hidden px-2">
            <button type="button" onClick={onBack} aria-label="Back to chats"
                className="flex shrink-0 items-center gap-2 py-2 text-left md:hidden"
            >
                <ArrowLeft size={20} />
                <span>{friend.displayName}</span>
            </button>
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
                {loadingMessages && <p role="status">Loading messages...</p>}
                {messagesError && <p role="alert" className="text-danger">{messagesError}</p>}
                <MessagesArea messages={messages} friendshipId={friendshipId} sendingMessage={sendingMessage}
                    userId={user?.userId}
                />
                <ChatInput username={username} sendingMessage={sendingMessage} onSend={(e) => handleSend(e)} />
            </div>
        </section>
    )
}