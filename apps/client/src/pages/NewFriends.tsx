import { useCallback, useEffect, useRef, useState } from "react";
import { API, axios } from "../apis/axios";
import { UserRound } from "lucide-react";
import SearchBar from "../components/Friends/SearchBar";
import type { ChangeEvent, SubmitEvent } from "react";
import type { DiscoverableUser, User } from "@chat-app/shared";
import NewFriendsRow from "../components/Friends/NewFriendsRow";
import { Link } from "react-router-dom";

export default function NewFriends() {
    const [query, setQuery] = useState<string>("");
    const [users, setUsers] = useState<DiscoverableUser[]>([]);
    const [submittedSearch, setSubmittedSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pendingRequests, setPendingRequests] = useState<Set<User["userId"]>>(() => new Set());
    const [sendingRequests, setSendingRequests] = useState<Set<User["userId"]>>(() => new Set());
    const [requestErrors, setRequestErrors] = useState<Map<User["userId"], string>>(() => new Map());
    const pendingRequestsRef = useRef(new Set<User["userId"]>());
    const incomingRequestsRef = useRef(new Set<User["userId"]>());
    const sendingRequestsRef = useRef(new Set<User["userId"]>());
    const requestId = useRef(0);

    const loadUsers = useCallback(async (search: string) => {
        const currentRequestId = ++requestId.current;
        setLoading(true);
        setError(null);
        setSubmittedSearch(search);
        try {
            const { data } = await API.get<{ message: string; data: DiscoverableUser[] }>("/users/discover", {
                params: { search }
            });
            if (currentRequestId === requestId.current) {
                setUsers(data.data);
                const discoveredOutgoing = data.data
                    .filter(user => user.hasOutgoingRequest)
                    .map(user => user.userId);
                const discoveredIncoming = data.data
                    .filter(user => user.hasIncomingRequest)
                    .map(user => user.userId);
                pendingRequestsRef.current = new Set(discoveredOutgoing);
                incomingRequestsRef.current = new Set(discoveredIncoming);
                setPendingRequests(new Set(discoveredOutgoing));
            }
        } catch (err) {
            if (currentRequestId === requestId.current) {
                if (axios.isAxiosError<{ error?: string }>(err)) {
                    setError(err.response?.data.error || "Couldn't load users. Please try again.");
                } else {
                    setError("Couldn't load users. Please try again.");
                }
            }
        } finally {
            if (currentRequestId === requestId.current) setLoading(false);
        }
    }, []);

    useEffect(() => { void loadUsers("") }, [loadUsers]);

    async function handleSendFriendRequest(userId: User["userId"]) {
        if (sendingRequestsRef.current.has(userId)
            || pendingRequestsRef.current.has(userId)
            || incomingRequestsRef.current.has(userId)) return;
        sendingRequestsRef.current.add(userId);
        setSendingRequests(current => new Set(current).add(userId));
        setRequestErrors(current => {
            const next = new Map(current);
            next.delete(userId);
            return next;
        });
        try {
            await API.post("/friends/friend-requests", { receiverId: userId });
            pendingRequestsRef.current.add(userId);
            setPendingRequests(current => new Set(current).add(userId));
        } catch (err) {
            const message = axios.isAxiosError<{ error?: string }>(err)
                ? err.response?.data.error || "Couldn't send friend request. Please try again."
                : "Couldn't send friend request. Please try again.";
            setRequestErrors(current => new Map(current).set(userId, message));
        } finally {
            sendingRequestsRef.current.delete(userId);
            setSendingRequests(current => {
                const next = new Set(current);
                next.delete(userId);
                return next;
            });
        }
    }

    async function handleSearch(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        await loadUsers(query.trim());
    }

    function handleQueryChange(e: ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
    }

    return (
        <div className="flex flex-col gap-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="mb-2 text-3xl font-semibold tracking-tight">Find people</h1>
                    <p className="text-muted">Search for people to connect with.</p>
                </div>

                <Link to={"/friends/friend-requests"} className="bg-primary text-white p-2 rounded-md">Check Requests</Link>
            </header>
            <SearchBar page="new-friends" onSubmit={handleSearch} value={query} onChange={handleQueryChange} />

            {error
                ? <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-danger">{error}</p>
                : (loading
                    ? <p role="status" className="py-8 text-center text-muted">Finding people...</p>
                    : (users.length === 0
                        ? <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-12 text-center">
                            <UserRound aria-hidden="true" className="size-8 text-muted" />
                            <h2 className="text-lg font-medium">No users found</h2>
                            <p className="text-muted">
                                {submittedSearch
                                    ? "Try another name or username."
                                    : "There are no people to discover right now."
                                }
                            </p>
                        </div>
                        : <ul className="grid grid-cols-1 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface lg:grid-cols-2 lg:divide-y-0">
                            {users.map(user => <NewFriendsRow key={user.userId} user={user}
                                onClick={() => handleSendFriendRequest(user.userId)}
                                isSending={sendingRequests.has(user.userId)}
                                hasOutgoingRequest={pendingRequests.has(user.userId)}
                                hasIncomingRequest={user.hasIncomingRequest}
                                error={requestErrors.get(user.userId)}
                            />)}
                        </ul>
                    )
                )
            }
        </div>
    )
}