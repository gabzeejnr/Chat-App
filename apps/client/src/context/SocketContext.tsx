import { createContext, useContext, useEffect, useState } from "react";
import { socket } from "../config/socket";
import type { ReactNode } from "react";
import type { ExtendedError, Socket } from "socket.io-client";
import type { SocketContextProp } from "../types";

const SocketContext = createContext<SocketContextProp | null>(null);

export default function SocketProvider({ children }: { children: ReactNode }) {

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [connectionError, setConnectionError] = useState<string | null>(null)
    const [isReconnecting, setIsReconnecting] = useState<boolean>(false)
    const onConnect = () => {
        socket.emit("howdy", "Hello from React!");
        setIsConnected(true);
        setConnectionError(null);
        setIsReconnecting(false);
    }
    const onDisconnect = (reason: Socket.DisconnectReason) => {
        setIsConnected(false);
        setConnectionError(null);
        setIsReconnecting(socket.active);
        if (reason === "io server disconnect") {
            console.log(reason)
        } else {
            console.log(`Client: ${socket.active}: ${reason}`)
        }
    }
    const onHello = (arg: unknown) => console.log(arg)
    const onConnectError = (err: ExtendedError) => {
        console.error("Connection error:", err.message)
        setConnectionError(err.message);
        setIsReconnecting(socket.active);
    }
    const value: SocketContextProp = {
        isConnected, socket, connectionError,
        isReconnecting
    }


    useEffect(() => {
        socket.on("hello", onHello);
        socket.on("connect_error", onConnectError);
        socket.on("disconnect", onDisconnect);
        socket.on("connect", onConnect);
        socket.connect();

        return () => {
            socket.off("hello", onHello);
            socket.off("connect_error", onConnectError);
            socket.off("disconnect", onDisconnect);
            socket.off("connect", onConnect);
            socket.disconnect();
        }
    }, [])


    return (
        <SocketContext value={value}>
            {children}
        </SocketContext>
    )
}


export function useSocket() {
    const ctx = useContext(SocketContext);
    if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
    return ctx
}