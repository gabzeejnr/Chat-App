import { useEffect, useState } from "react";
import { FRIEND_API, axios } from "../apis/axios";
import ChatList from "../components/Chats/ChatList";
import ChatArea from "../components/Chats/ChatArea";
import ChatDetailsPane from "../components/Chats/ChatDetailsPane";
import type { Friend } from "@chat-app/shared";

export default function Chats() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    function selectFriend(friend: Friend) {
        setSelectedFriend(friend);
        setIsChatOpen(true);
    }

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
            <div className="relative flex h-full overflow-hidden md:gap-2">
                <aside className="absolute inset-0 z-10 w-full overflow-y-auto md:relative md:inset-auto md:z-auto md:w-64 md:shrink-0">
                    {friends.map(friend => <ChatList key={friend.friendshipId} friend={friend} isSelected={friend.friendshipId === selectedFriend?.friendshipId} onSelectFriend={selectFriend} />)}
                </aside>
                {selectedFriend
                    ? <>
                        <div className={`absolute inset-0 z-20 h-full w-full bg-white transition-transform duration-300 ease-in-out md:relative md:inset-auto md:z-auto md:w-auto md:flex-2 md:translate-x-0 ${isChatOpen ? "translate-x-0" : "translate-x-full"}`}>
                            <ChatArea key={selectedFriend.friendshipId} friend={selectedFriend} onBack={() => setIsChatOpen(false)} />
                        </div>
                        <ChatDetailsPane friend={selectedFriend} />
                    </>
                    : <div className="hidden w-full place-items-center md:grid">
                        No chat selected... Select a chat to get started
                    </div>
                }
            </div>
        </div>
    )
}