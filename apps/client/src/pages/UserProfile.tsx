import { useEffect, useState } from "react";
import { USER_API } from "../apis/axios";
import { useParams } from "react-router-dom"
import type { User } from "@chat-app/shared";

export default function UserProfile() {
    const { userId } = useParams<{ userId: string }>();
    if (!userId) return <div>No userId inputed</div>;
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);


    async function getUser(userId: string) {
        try {
            setUser(null);
            setError(null);
            const { data } = await USER_API.get<{ message: string; data: User }>(`/${userId}`);
            setUser(data.data)
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => { void getUser(userId) }, [userId])

    return (
        <div>
            {user && Object.entries(user).map(([key, value]) => <p key={value}><strong>{key}</strong>: {value}</p>)}
        </div>
    )
}