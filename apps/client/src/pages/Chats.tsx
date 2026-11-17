import { useEffect, useState } from "react";
import { FRIEND_API, axios } from "../apis/axios";
import ChatList from "../components/Chats/ChatList";
import ChatArea from "../components/Chats/ChatArea";
import ChatDetailsPane from "../components/Chats/ChatDetailsPane";
import type { Friend, PaginatedApiSuccess } from "@chat-app/shared";
import Pagination from "../components/Pagination";

export default function Chats() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [friends, setFriends] = useState<Friend[]>([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<PaginatedApiSuccess<Friend[]>["meta"] | null>(null);
    const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);

    function selectFriend(friend: Friend) {
        setSelectedFriend(friend);
        setIsChatOpen(true);
    }

    function onBack() {
        setIsChatOpen(false);
        setSelectedFriend(null);
    }

    async function loadFriends(signal: AbortSignal, requestedPage: number) {
        setLoading(true);
        setError(null);
        try {
            const { data } = await FRIEND_API.get<PaginatedApiSuccess<Friend[]>>("", {
                params: { page: requestedPage },
                signal
            });
            setFriends(data.data);
            setPagination(data.meta);
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
        void loadFriends(controller.signal, page);
        return () => controller.abort();
    }, [page]);


    return (
        <div className="h-full">
            <div className="relative flex h-full overflow-hidden md:gap-2">
                <div className="relative h-full w-full flex flex-col flex-1">
                    <aside className={`absolute inset-x-0 h-full top-0 z-10 w-full overflow-y-auto ${pagination && pagination.pagination.totalPages > 1 ? "bottom-16" : "bottom-0"} md:relative md:inset-auto md:z-auto md:w-64 md:shrink-0`}>
                        {loading ? (
                            <p role="status" className="py-8 text-center text-muted">Loading friends...</p>
                        ) : error ? (
                            <p role="alert" className="p-4 text-danger">{error}</p>
                        ) : friends.map(friend => (
                            <ChatList key={friend.friendshipId} friend={friend}
                                isSelected={friend.friendshipId === selectedFriend?.friendshipId} onSelectFriend={selectFriend}
                                lastMessage="Test this lengthy sentence to test truncation"
                            />
                        ))}
                    </aside>
                    {!loading && !error && pagination && (
                        <Pagination page={pagination.pagination.page} totalPages={pagination.pagination.totalPages}
                            hasNextPage={pagination.pagination.hasNextPage}
                            hasPreviousPage={pagination.pagination.hasPreviousPage} onPageChange={setPage}
                        />
                    )}
                </div>
                {selectedFriend
                    ? <div className="relative flex w-full flex-5">
                        <div className={`absolute inset-0 z-20 h-full w-full bg-white transition-transform duration-300 ease-in-out md:relative md:inset-auto md:z-auto md:w-auto md:flex-2 md:translate-x-0 ${isChatOpen ? "translate-x-0" : "translate-x-full"}`}>
                            <ChatArea friend={selectedFriend} onBack={onBack} />
                        </div>
                        <ChatDetailsPane friend={selectedFriend} />
                    </div>
                    : <div className="hidden w-full place-items-center md:grid">
                        No chat selected... Select a chat to get started
                    </div>
                }
            </div>
        </div>
    )
}