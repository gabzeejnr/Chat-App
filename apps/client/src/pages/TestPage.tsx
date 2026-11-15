import { useUser } from "../context/UserContext";
import type { User } from "@chat-app/shared";

export default function HomeTest() {

    const { user } = useUser();
    return (
        <div>
            {Object.entries(user as User).map(([key, value]) =>
                <p key={key}><strong>{key}</strong>: {value}</p>
            )}
            <img src={user?.avatarUrl} alt={`${user?.username} profile picture`} />
        </div>
    )
}