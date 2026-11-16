import ProfilePicture from "../Avatar";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Friend } from "@chat-app/shared";
import { toInitials } from "../../libs";

interface ChatListProps {
    friend: Friend;
    isSelected: boolean;
    selectedFriendId?: string;
    setSelectedFriend: Dispatch<SetStateAction<Friend | null>>
}

export default function ChatList({ friend, selectedFriendId, setSelectedFriend, isSelected }: ChatListProps) {

    const { avatarUrl, displayName, userId } = friend;
    const unreadCount = 99;
    const isActive = friend.userId === selectedFriendId

    return (
        <button type="button" className={`flex gap-3 w-full justify-between items-center rounded-lg cursor-pointer hover:bg-background ${isActive ? "bg-background" : ""} px-1 py-2 transition-colors duration-300`}
            onClick={() => setSelectedFriend(friend)}
        >
            <ProfilePicture key={`${userId}-${avatarUrl}`} url={avatarUrl} name={displayName} size={14} initials={(toInitials(displayName)).slice(0, 2)} />
            <div className="flex flex-col h-full gap-2">
                <span className="font-medium text-left">{displayName}</span>
                <span className="text-gray-400 font-thin text-sm max-w-35 truncate">Hey, I forgot to mention</span>
            </div>
            <div className="flex flex-col gap-2 items-center justify-between h-full">
                <span className="text-gray-700">10m</span>
                <span aria-label={`${unreadCount} unread messsages`} className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white bg-danger">{unreadCount}</span>
            </div>
        </button >
    )
}