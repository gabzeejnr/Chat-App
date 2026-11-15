import { useEffect, useState } from "react";
import { FRIEND_API, axios } from "../apis/axios";
import ChatList from "../components/Chats/ChatList";
import ChatArea from "../components/Chats/ChatArea";
import ChatDetailsPane from "../components/Chats/ChatDetailsPane";
import type { Friend } from "@chat-app/shared";

export default function Chats() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedFriend, setselectedFriend] = useState<Friend | null>(null);


    async function loadFriends(signal: AbortSignal) {
        setLoading(true);
        setError(null);
        try {
            const { data } = await FRIEND_API.get<{ message: string; data: Friend[] }>("", {
                signal
            });
            setFriends(data.data);
        } catch (err) {
            if (!signal.aborted) {
                const message = axios.isAxiosError<{ error?: string }>(err)
                    ? err.response?.data.error || "Couldn't load friends. Please try again."
                    : "Couldn't load friends. Please try again.";
                setError(message);
            }
        } finally {
            if (!signal.aborted) setLoading(false);
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        void loadFriends(controller.signal);
        return () => controller.abort();
    }, []);

    return (
        <div className="h-full">
            <div className="flex gap-2 h-full">
                <aside className="h-full">
                    {friends.map(friend => <ChatList key={friend.friendshipId} friend={friend} setSelectedFriend={setselectedFriend} />)}
                </aside>
                {selectedFriend
                    ? <>
                        <ChatArea username={selectedFriend?.username} />
                        <ChatDetailsPane friend={selectedFriend} />
                    </>
                    : <div className="border w-full">
                        
                    </div>
                }
            </div>
        </div>
    )
}