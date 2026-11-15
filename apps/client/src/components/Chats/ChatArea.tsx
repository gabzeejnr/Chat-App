import { useLayoutEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import type { SubmitEvent, KeyboardEvent } from "react";
import type { Friend } from "@chat-app/shared";
import styles from "./Chats.module.scss"

function ChatInput({ username, onSend }: { username: string; onSend?: (message: string) => void }) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const canSend = value.trim().length > 0;

    useLayoutEffect(function () {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    function send() {
        if (!canSend) return;
        onSend?.(value.trim());
        setValue("");
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
            <textarea ref={textareaRef} rows={1} value={value} placeholder={`Chat with ${username}`}
                onKeyDown={handleKeyDown} onChange={e => setValue(e.target.value)}
                className="max-h-40 min-h-9 flex-1 resize-none overflow-y-auto bg-transparent py-2 text-foreground outline-none placeholder:text-muted"
            />
            <button type="submit" disabled={!canSend} aria-label="Send message"
                className="mb-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-white transition-opacity duration-150 disabled:opacity-40"
            >
                <SendHorizontal className="size-4" />
            </button>
        </form>
    )
}

function MessagesArea({ messages }: {
    messages: {
        id: string;
        role: "user" | "friend";
        content: string;
    }[]
}) {
    return (
        <div className={`${styles.wrapper} border h-full mb-15`}>
            {messages.map((message) => (
                <div key={message.id}
                    className={
                        message.role === "user" ? styles.user : styles.friend}>
                    {message.content}
                </div>
            ))}
        </div>
    )
}

export default function ChatArea({ friend }: { friend: Friend }) {
    const { username } = friend;

    return (
        <section className="flex-2 relative flex flex-col h-full">
            <MessagesArea messages={[{
                id: string,
                role: "user" | "friend",
                content: string;
            }]} />
            <ChatInput username={username} onSend={(e) => alert(e)} />
        </section>
    )
}