import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SendHorizontal, Check, CheckCheck, Clock3 } from "../../libs";
import type { SubmitEvent, KeyboardEvent } from "react";
import type { Friend } from "@chat-app/shared";
import styles from "./Chats.module.scss"
import { API, axios } from "../../apis/axios";
import { toTime } from "../../utils";

function ChatInput({ username, sendingMessage, onSend }: {
    username: string;
    sendingMessage: boolean;
    onSend?: (message: string) => Promise<void>;
}) {
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

interface Messages {
    id: string;
    role: "user" | "friend";
    content: string;
    dateCreated: string;
}

function MessagesArea({ messages, friendshipId, sendingMessage }: {
    messages: Messages[];
    friendshipId: string;
    sendingMessage: boolean;
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
                    className={`${message.role === "user" ? styles.user : styles.friend}
                    flex gap-1 py-2 px-4 mt-4 w-fit rounded-[20px] max-w-3/4 wrap-break-word relative`}
                >
                    <span>{message.content}</span>
                    <span className="self-end-safe flex items-end">
                        <span className="text-[8px]">{toTime(message.dateCreated)}</span>
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

export default function ChatArea({ friend }: { friend: Friend }) {
    const { username, userId, friendshipId } = friend;
    const [messages, setMessages] = useState<Messages[]>([]);
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

                const { data } = await API.get<{ message: string; data: Messages[] }>("/test/messages", {
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
            const messageData: Messages = {
                id: crypto.randomUUID(),
                role: "user",
                content: e,
                dateCreated: new Date().toISOString()
            }
            await API.post("/test/send-message", { message: messageData })
            setMessages(previousMessages => [...previousMessages, messageData]);
            setSendingMessage(false);
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

    return (
        <section className="flex-2 relative flex flex-col h-full px-2 overflow-hidden">
            {loadingMessages && <p role="status">Loading messages...</p>}
            {messagesError && <p role="alert" className="text-danger">{messagesError}</p>}
            <MessagesArea messages={messages} friendshipId={friendshipId} sendingMessage={sendingMessage} />
            <ChatInput username={username} sendingMessage={sendingMessage} onSend={(e) => handleSend(e)} />
        </section>
    )
}