import { UserRound } from "lucide-react";
import type { Friend } from "@chat-app/shared";

interface FriendRowProp {
    friend: Friend;
    onClick: () => void;
}

export default function FriendRow({ friend }: FriendRowProp) {
    return (
        <li className="flex items-center gap-3 p-4">
            {friend.avatarUrl
                ? <img src={friend.avatarUrl} alt="" loading="lazy" referrerPolicy="no-referrer"
                    className="size-11 shrink-0 rounded-full border border-border object-cover"
                />
                : <div className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-hover text-muted">
                    <UserRound aria-hidden="true" className="size-5" />
                </div>
            }
            <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium">{friend.displayName}</h3>
                <p className="truncate text-sm text-muted">@{friend.username}</p>
            </div>
        </li>
    )
}