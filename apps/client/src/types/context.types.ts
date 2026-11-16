import { socket } from "../config/socket";
import type { NewMessageEvent, User } from "@chat-app/shared";

type Theme = "light" | "dark" | "system";

interface SocketContextProp {
    isConnected: boolean;
    socket: typeof socket;
    connectionError: string | null;
    isReconnecting: boolean;
    subscribeToNewMessages: (listener: (event: NewMessageEvent) => void) => () => void;
}

interface UserContextProp {
    user: User | null;
    setUser: (user: User | null) => void;
    initials: string;
    loading: boolean;
    logOut: () => Promise<void>
}

interface ThemeContextProp {
    theme: Theme;
    toggleTheme: (theme?: Theme) => void;
}


export type { SocketContextProp, UserContextProp, ThemeContextProp }