import { useState } from "react";
import { useUser } from "../context/UserContext";
import { UserRound } from "lucide-react";

export default function Avatar({ size }: { size: string | number }) {
    const { user } = useUser();
    const [hasError, setHasError] = useState(false);

    if (hasError || !user?.avatarUrl) {
        return (
            <div className={`grid size-${size} place-items-center overflow-hidden rounded-full border border-sidebar-border bg-sidebar-active text-sidebar-muted`}>
                <UserRound className="size-4" />
            </div>
        )
    }

    return (
        <div className={`size-${size} overflow-hidden rounded-full border border-sidebar-border`}>
            <img src={user?.avatarUrl} alt={`${user?.displayName}'s profile picture`} loading="lazy" referrerPolicy="no-referrer"
                onError={() => setHasError(true)} className="h-full w-full object-cover"
            />
        </div>
    )
}