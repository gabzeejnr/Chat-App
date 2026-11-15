import type { Friend } from "@chat-app/shared";
import ProfilePicture from "../Avatar";
import { toInitials } from "../../libs";
import { Link } from "react-router-dom";

export default function ChatDetailsPane({ friend }: { friend: Friend }) {
    return (
        <div className="flex-1 hidden md:flex flex-col items-center pl-5 pt-5 shadow bg-gray-100 rounded-md">
            <ProfilePicture size={30} name={friend.displayName} url={friend.avatarUrl} initials={toInitials(friend.displayName).slice(0, 2)} />
            <div className="name mt-10 divide-y self-start">
                <div className="p-1 flex flex-col gap-1">
                    <span className="text-gray-800 font-medium text-lg">{friend.displayName}</span>
                    <span className="text-[14px] text-gray-700">Name</span>
                </div>
                <div className="p-1 flex flex-col gap-1">
                    <Link to={`/users/${friend.userId}`} className="text-blue-600">
                        @{friend.username}
                    </Link>
                    <span className="text-[14px] text-gray-700">username</span>
                </div>
            </div>
        </div>
    )
}