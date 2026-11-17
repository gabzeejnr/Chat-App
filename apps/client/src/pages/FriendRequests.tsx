import { useEffect, useState } from "react";
import { UserRound, Check, X } from "../libs";
import { FRIEND_API, axios } from "../apis/axios";
import type { FriendRequest, PaginatedApiSuccess } from "@chat-app/shared";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Pagination from "../components/Pagination";

export default function FriendRequests() {
    const { user } = useUser();
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<PaginatedApiSuccess<FriendRequest[]>["meta"] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadRequests() {
            setLoading(true);
            setError(null);
            try {
                const { data } = await FRIEND_API.get<PaginatedApiSuccess<FriendRequest[]>>("/friend-requests", {
                    params: { page },
                    signal: controller.signal
                });
                setRequests(data.data);
                setPagination(data.meta);
            } catch (err) {
                if (!controller.signal.aborted) {
                    const message = axios.isAxiosError<{ error?: string }>(err)
                        ? err.response?.data.error || "Couldn't load friend requests. Please try again."
                        : "Couldn't load friend requests. Please try again.";
                    setError(message);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        void loadRequests();
        return () => controller.abort();
    }, [page]);

    async function handleRequest(requestId: string, action: "accept" | "reject") {
        setProcessingRequestId(requestId);
        setActionError(null);
        try {
            await FRIEND_API.post(action === "accept"
                ? "/accept-request"
                : "/reject-request",
                { requestId }
            );
            setRequests(current => current.filter(request => request.id !== requestId));
            setPagination(current => {
                if (!current) return current;
                const total = Math.max(0, current.total - 1);
                const totalPages = Math.ceil(total / current.pagination.limit);
                return {
                    ...current,
                    total,
                    count: Math.max(0, current.count - 1),
                    pagination: {
                        ...current.pagination,
                        total,
                        totalPages,
                        hasNextPage: current.pagination.page < totalPages,
                        hasPreviousPage: current.pagination.page > 1
                    }
                };
            });
            if (requests.length === 1 && page > 1) setPage(current => current - 1);
        } catch (err) {
            const message = (axios.isAxiosError<{ error?: string }>(err)
                ? err.response?.data.error
                || `Couldn't ${action} friend request. Please try again.`
                : `Couldn't ${action} friend request. Please try again.`
            )
            setActionError(message);
        } finally {
            setProcessingRequestId(null);
        }
    }

    return (
        <section className="flex flex-col gap-5">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1>FRIEND REQUESTS</h1>
                    {!loading && !error && pagination && <span className="self-baseline-last -translate-y-3">({pagination.total})</span>}
                </div>
            </header>
            {actionError && (
                <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-danger">{actionError}</p>
            )}
            <div>
                {error ? (
                    <p role="alert" className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-danger">{error}</p>
                ) : loading ? (
                    <p role="status" className="py-8 text-center text-muted">Loading friend requests...</p>
                ) : requests.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border px-6 py-12 text-center">
                        <UserRound aria-hidden="true" className="size-8 text-muted" />
                        <h2 className="text-lg font-medium">No pending requests</h2>
                        <p className="text-muted">When someone sends you a friend request, you'll find it here.</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
                        {requests.map(request => (
                            <li key={request.id} className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap">
                                {request.avatarUrl
                                    ? <img src={request.avatarUrl} alt="" className="size-11 shrink-0 rounded-full border border-border object-cover" />
                                    : <div className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-hover text-muted">
                                        <UserRound aria-hidden="true" className="size-5" />
                                    </div>
                                }
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-medium">{request.displayName}</h3>
                                    <Link to={`/users/${request.senderId === user?.userId ? request.receiverId : request.senderId}`}>
                                        <p className="truncate text-sm text-muted">@{request.username}</p>
                                    </Link>
                                    <p className="mt-1 text-xs text-muted">{new Date(request.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="flex w-full items-center gap-2 sm:w-auto">
                                    <button type="button" onClick={() => void handleRequest(request.id, "accept")}
                                        disabled={processingRequestId !== null}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                                    >
                                        <Check aria-hidden="true" size={16} />
                                        {processingRequestId === request.id ? "Processing..." : "Accept"}
                                    </button>
                                    <button type="button" onClick={() => void handleRequest(request.id, "reject")}
                                        disabled={processingRequestId !== null}
                                        aria-label={`Decline request from ${request.displayName}`}
                                        className="flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-danger hover:bg-danger/10 hover:text-danger disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <X aria-hidden="true" size={16} />
                                        <span className="sm:hidden">Decline</span>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                {!loading && !error && pagination && (
                    <Pagination
                        page={pagination.pagination.page}
                        totalPages={pagination.pagination.totalPages}
                        hasNextPage={pagination.pagination.hasNextPage}
                        hasPreviousPage={pagination.pagination.hasPreviousPage}
                        onPageChange={setPage}
                    />
                )}
            </div>
        </section>
    )
}