import { useState } from "react";
import { UserRound } from "../libs";

interface AvatarProps {
    size?: number;
    url: string;
    name: string;
    initials?: string;
}

export default function ProfilePicture({ size = 4, url, name, initials }: AvatarProps) {
    const [hasError, setHasError] = useState(false);
    const dimension = `calc(var(--spacing) * ${size})`;
    const style = { width: dimension, height: dimension };

    if (hasError || !url) {
        return (
            <div style={style} className={`flex items-center justify-center overflow-hidden rounded-full border border-sidebar-border bg-sidebar-active ${initials ? "text-white" : "text-sidebar-muted"}`}>
                {!initials
                    ? <UserRound style={style} strokeWidth={size / 5} />
                    : <div style={{ fontSize: size * 1.5  }} className={`w-full h-full grid place-items-center font-semibold`}>{initials}</div>
                }
            </div>
        );
    }

    return (
        <div style={style} className="overflow-hidden rounded-full">
            <img src={url} alt={`${name}'s profile picture`} loading="lazy" referrerPolicy="no-referrer"
                onError={() => setHasError(true)} className="h-full w-full object-cover"
            />
        </div>
    );
}