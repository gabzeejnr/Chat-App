import { createContext, useContext, useEffect, useState } from "react";
import { AUTH } from "../apis/axios";
import type { ReactNode } from "react";
import type { UserContextProp } from "../types";

const UserContext = createContext<UserContextProp | null>(null);

export default function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserContextProp["user"] | null>(null);
    const [loading, setLoading] = useState<boolean>(true); 
    const initials = (user?.displayName
        ?.trim()
        .split(/\s+/)
        .filter(Boolean)
        .map(n => n[0]?.toUpperCase())
        .join("")
    ) || "U";

    useEffect(() => {
        async function getAuthenticated() {
            try {
                const { data } = await AUTH.get<{
                    message: string;
                    data: NonNullable<UserContextProp["user"]>;
                }>("/me");
                setUser(data.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        void getAuthenticated();
    }, [])

    async function logOut() {
        try {
            await AUTH.post("/logout");
            setUser(null)
        } catch (err) {
            console.log(err);
        }
    }

    const value: UserContextProp = {
        user,
        setUser,
        initials,
        loading,
        logOut
    };

    return (
        <UserContext value={value}>
            {children}
        </UserContext>
    )
}


export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
}