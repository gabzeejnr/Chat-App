import { UserRound, UserRoundPlus } from "lucide-react"
import type { User } from "@chat-app/shared";

interface NewfriendsRowProps {
    user: User;
    onClick: () => void;
    isSending: boolean;
    hasOutgoingRequest: boolean;
    hasIncomingRequest: boolean;
    error?: string;
}


export default function NewFriendsRow({ user, onClick, isSending, hasOutgoingRequest, hasIncomingRequest, error }: NewfriendsRowProps) {
    return (
        <li className="flex items-center gap-3 p-4">
            {user.avatarUrl
                ? <img src={user.avatarUrl} alt="" loading="lazy" referrerPolicy="no-referrer"
                    className="size-11 rounded-full border border-border object-cover"
                />
                : <div className="grid size-11 shrink-0 place-items-center rounded-full bg-surface-hover text-muted">
                    <UserRound aria-hidden="true" className="size-5" />
                </div>
            }
            <div className="min-w-0 flex-1">
                <h3 className="truncate font-medium">{user.displayName}</h3>
                <p className="truncate text-sm text-muted">@{user.username}</p>
                {error && <p role="alert" className="mt-1 text-sm text-danger">{error}</p>}
            </div>
            <button type="button" onClick={onClick} disabled={isSending || hasOutgoingRequest || hasIncomingRequest}
                aria-label={`${isSending ? "Sending request to" : hasOutgoingRequest ? "Request sent to" : hasIncomingRequest ? "Incoming request from" : "Add"} ${user.displayName}`}
                className="shrink-0 flex gap-1 items-center cursor-pointer rounded-lg bg-primary px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
                {!isSending && !hasOutgoingRequest && !hasIncomingRequest && <UserRoundPlus aria-hidden="true" />}
                {isSending
                    ? "Sending..."
                    : (hasOutgoingRequest
                        ? "Request Sent"
                        : (hasIncomingRequest
                            ? "Incoming Request"
                            : "Add Friend"
                        )
                    )
                }
            </button>
        </li>
    )
}