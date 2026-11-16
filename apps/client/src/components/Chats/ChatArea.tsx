import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useSocket } from "../../context/SocketContext";
import { axios, MESSAGE_API } from "../../apis/axios";
import { ArrowLeft, SendHorizontal } from "../../libs";
import { toTime } from "../../utils";
import type { SubmitEvent, KeyboardEvent } from "react";
import type { Friend, ClientMessage, UUID } from "@chat-app/shared";
import type { ChatInputProps, MessagesAreaProps } from "../../types";
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

function MessagesArea({ messages, friendshipId, userId }: MessagesAreaProps) {
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages.length, friendshipId])

    return (
        <div className={`${styles.wrapper} h-full mb-15 overflow-y-auto scrollbar-thumb-expand`}>
            {!messages.length
                ? <div className="h-full grid place-items-center">No messages yet, send a message to get started.</div>
                : messages.map(message => (
                    <div key={message.id}
                        className={`${message.senderId === userId ? styles.user : styles.friend}
                    flex gap-1 py-2 px-4 mt-4 w-fit rounded-[20px] max-w-3/4 wrap-break-word relative`}
                    >
                        <span>{message.content}</span>
                        <span className="self-end-safe flex items-end">
                            <span className="text-[8px]">{toTime(message.createdAt)}</span>
                        </span>
                    </div>
                ))
            }
            <div ref={bottomRef} />
        </div>
    )
}

export default function ChatArea({ friend, onBack }: { friend: Friend; onBack: () => void }) {
    const { user } = useUser();
    const { subscribeToNewMessages } = useSocket();
    const { username, friendshipId } = friend;
    const currentFriendship = useRef<UUID | null>(friendshipId);
    const [messages, setMessages] = useState<ClientMessage[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [messagesError, setMessagesError] = useState<string | null>(null);
    const [sendingMessage, setSendingMessage] = useState(false);

    async function loadMessages(signal: AbortSignal) {
        const activeFriendshipId = friendshipId;
        try {
            setMessages([]);
            setMessagesError(null);
            setLoadingMessages(true);

            const { data } = await MESSAGE_API.get<{ message: string; data: ClientMessage[] }>(`/${activeFriendshipId}/messages`, { signal });
            if (signal.aborted || activeFriendshipId !== currentFriendship.current) return;
            setMessages(data.data);
        } catch (err) {
            if (!signal.aborted && activeFriendshipId === currentFriendship.current) {
                const message = axios.isAxiosError<{ error?: string }>(err)
                    ? err.response?.data.error || "Couldn't load messages. Please try again."
                    : "Couldn't load messages. Please try again.";
                setMessagesError(message);
            }
        } finally {
            if (!signal.aborted && activeFriendshipId === currentFriendship.current) setLoadingMessages(false);
        }
    }

    useLayoutEffect(() => {
        currentFriendship.current = friendshipId;
    }, [friendshipId]);

    useEffect(() => subscribeToNewMessages(({ friendshipId: eventFriendshipId, message }) => {
        if (eventFriendshipId !== currentFriendship.current) return;
        setMessages(previous => [...previous, message]);
    }), [friendshipId, subscribeToNewMessages]);

    useEffect(() => {
        const controller = new AbortController();
        setSendingMessage(false);
        void loadMessages(controller.signal);
        return () => controller.abort();
    }, [friendshipId]);

    async function handleSend(message: string) {
        setSendingMessage(true);
        const activeFriendshipId = friendshipId
        try {
            const { data } = await MESSAGE_API.post<{ message: string; data: ClientMessage }>(`/${activeFriendshipId}/messages`, { content: message })
            if (activeFriendshipId !== currentFriendship.current) return;

            setMessages(previous => [...previous, data.data]);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            if (activeFriendshipId === currentFriendship.current) {
                setSendingMessage(false);
            }
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
                <MessagesArea messages={messages} friendshipId={friendshipId} userId={user?.userId} />
                <ChatInput username={username} sendingMessage={sendingMessage} onSend={(e) => handleSend(e)} />
            </div>
        </section>
    )
}