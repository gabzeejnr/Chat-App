import type { Friend } from "@chat-app/shared";

export default function ChatDetailsPane({friend}:{friend: Friend}) {
    return (
        <div className="flex-1 hidden md:flex">
            <div className="details"></div>
        </div>
    )
}