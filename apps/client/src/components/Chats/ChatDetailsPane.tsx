import type { Friend } from "@chat-app/shared";
import {UserAvatar} from "../Avatar";

export default function ChatDetailsPane({ friend }: { friend: Friend }) {
    return (
        <div className="flex-1 hidden md:flex justify-center pt-5 border">
            <div className="details">
                <UserAvatar size={40} />
            </div>
        </div>
    )
}