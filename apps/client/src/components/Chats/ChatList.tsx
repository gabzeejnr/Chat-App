import { useState, type Dispatch, type SetStateAction } from "react"
import type { Friend } from "@chat-app/shared";


function Avatar({ avatarUrl, displayName }: { avatarUrl: string; displayName: string }) {
    const [imageError, setImageError] = useState(false);
    const getInitials = () => (displayName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(n => n.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("")
    ) || "U"

    return (
        <div className="size-14 bg-foreground overflow-hidden rounded-md">
            {!imageError && avatarUrl
                ? <img src={avatarUrl} alt={`${displayName}'s profile picture`} loading="lazy" referrerPolicy="no-referrer"
                    onError={() => setImageError(true)} className="h-full w-full object-cover"
                />
                : <div className="flex h-full text-white font-semibold text-2xl items-center justify-center">
                    {getInitials()}
                </div>
            }
        </div>
    )
}

export default function ChatList({ friend, setSelectedFriend }: { friend: Friend; setSelectedFriend: Dispatch<SetStateAction<Friend | null>> }) {

    const { avatarUrl, displayName } = friend;

    return (
        <button type="button" className="flex gap-3 w-full justify-between items-center cursor-pointer hover:bg-background px-1 py-2 transition-colors duration-300"
            onClick={() => setSelectedFriend(friend)}
        >
            <Avatar key={avatarUrl} avatarUrl={avatarUrl} displayName={displayName} />
            <div className="flex flex-col h-full gap-2">
                <span className="font-medium text-left">{displayName}</span>
                <span className="text-gray-400 font-thin text-sm max-w-35 truncate">Hey, I forgot to mention</span>
            </div>
            <div className="flex flex-col gap-2 items-center justify-between h-full">
                <span className="text-gray-700">10m</span>
                <span aria-label="10 notifications" className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white bg-danger">99</span>
            </div>
        </button >
    )
}