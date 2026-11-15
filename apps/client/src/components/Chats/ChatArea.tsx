import { useLayoutEffect, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import type { SubmitEvent, KeyboardEvent } from "react";
import type { Friend } from "@chat-app/shared";

function ChatInput({ username, onSend }: { username: string; onSend?: (message: string) => void; }) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const canSend = value.trim().length > 0;

    useLayoutEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [value]);

    const send = () => {
        if (!canSend) return;
        onSend?.(value.trim());
        setValue("");
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
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

export default function ChatArea({ friend }: { friend: Friend }) {
    const { username } = friend;

    return (
        <section className="flex-2 relative flex flex-col h-full">
            <ChatInput username={username} />
        </section>
    )
}