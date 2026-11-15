import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UserRound, RotateCw } from "lucide-react";
import { FRIEND_API, axios } from "../apis/axios";
import FriendRow from "../components/Friends/FriendRow";
import type { Friend } from "@chat-app/shared"

export default function Friends() {
    const [friends, setFriends] = useState<Friend[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const controller = useRef((new AbortController()).signal)

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
        <div className="flex flex-col gap-5">
            <header className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <h1>FRIENDS</h1>
                    {!loading && !error && <span className="self-baseline-last -translate-y-3">({friends.length})</span>}
                </div>
                <Link to={"/new-friends"} className="border p-2 text-primary hover:bg-primary-hover hover:text-white transition-colors duration-300 rounded-md cursor-pointer">+ Add Friend</Link>
            </header>
            <div>
                {error
                    ? <p role="alert" className="flex justify-between rounded-lg border border-danger/30 bg-danger/10 p-4 text-danger">
                        {error}
                        <button type="button" title="Reload Friend list" onClick={() => loadFriends(controller.current)}>
                            <RotateCw size={20} />
                        </button>
                    </p>
                    : (loading
                        ? <p role="status" className="py-8 text-center text-muted">Loading friends list...</p>
                        : (friends.length === 0
                            ? <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-12 text-center">
                                <UserRound aria-hidden="true" className="size-8 text-muted" />
                                <h2 className="text-lg font-medium">No friends added</h2>
                                <Link to={"/new-friends"} className="underline text-muted hover:text-primary-hover">Add a friend</Link>
                            </div>
                            : <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
                                {friends.map(friend => <FriendRow key={friend.friendshipId} friend={friend} onClick={() => { }} />)}
                            </ul>
                        )
                    )
                }
            </div>
        </div>
    )
}