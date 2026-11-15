import { useState } from "react";
import { UserRound } from "lucide-react";
import { useUser } from "../context/UserContext";

interface AvatarProps {
    size?: number;
    url: string;
    name: string;
    initials?: string;
}

export function UserAvatar({ size = 4, url, name, initials }: AvatarProps) {
    const { user } = useUser();
    const [hasError, setHasError] = useState(false);
    const dimension = `calc(var(--spacing) * ${size})`;
    const style = { width: dimension, height: dimension };

    if (hasError || !user?.avatarUrl) {
        return (
            <div style={style} className="grid place-items-center overflow-hidden rounded-full border border-sidebar-border bg-sidebar-active text-sidebar-muted">
                {!initials
                    ? <UserRound className="size-4" />
                    : <div className="w-full h-full text-xl">{initials}</div>
                }
            </div>
        );
    }

    return (
        <div style={style} className="overflow-hidden rounded-full">
            <img src={user.avatarUrl} alt={`${user.displayName}'s profile picture`} loading="lazy" referrerPolicy="no-referrer"
                onError={() => setHasError(true)} className="h-full w-full object-cover"
            />
        </div>
    );
}

export function FriendAvatar({ size = 4 }: { size?: number }) {
    const { user } = useUser();
    const [hasError, setHasError] = useState(false);
    const dimension = `calc(var(--spacing) * ${size})`;
    const style = { width: dimension, height: dimension };

    if (hasError || !user?.avatarUrl) {
        return (
            <div style={style} className="grid place-items-center overflow-hidden rounded-full border border-sidebar-border bg-sidebar-active text-sidebar-muted">
                <UserRound className="size-4" />
            </div>
        );
    }

    return (
        <div style={style} className="overflow-hidden rounded-full">
            <img src={user.avatarUrl} alt={`${user.displayName}'s profile picture`} loading="lazy" referrerPolicy="no-referrer"
                onError={() => setHasError(true)} className="h-full w-full object-cover"
            />
        </div>
    );
}