import { createServer } from "node:http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { apiRouter } from "./routes/api/routes.js";
import { JWT_SECRET } from "./config/env.js";
import type { Express } from "express";
import type { DefaultEventsMap } from "socket.io";

const app: Express = express();
const origin = ["http://localhost:5173"];
const PORT = Number(process.env.PORT) || 4000;

app.use(cors({ origin, credentials: true }));
app.use(cookieParser());
app.use(express.json());
const server = createServer(app);


interface SocketData {
    userId: string;
}

const io = new Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>(server, {
    cors: {
        origin,
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.set("io", io);

io.use((socket, next) => {
    const cookieHeader = socket.handshake.headers.cookie;
    const accessTokenCookie = cookieHeader
        ?.split(";")
        .map(cookie => cookie.trim())
        .find(cookie => cookie.startsWith("accessToken="));
    const token = accessTokenCookie?.slice("accessToken=".length);

    if (!token) {
        next(new Error("Authentication required."));
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
        if (
            typeof decoded === "string" ||
            decoded.purpose !== "access" ||
            typeof decoded.userId !== "string" ||
            !decoded.userId
        ) {
            next(new Error("Invalid or expired access token."));
            return;
        }

        socket.data.userId = decoded.userId;
        next();
    } catch {
        next(new Error("Invalid or expired access token."));
    }
});

io.on("connection", (socket) => {
    socket.join(socket.data.userId)
    socket.emit("hello", "Hello from NodeJs");
    console.log(`New client connected: ${socket.id}, user: ${socket.data.userId}`);
    socket.on("howdy", (arg) => console.log(arg))
})

app.use("/api", apiRouter);

app.use((_req, res) => res.json({ error: "Unknown route" }))
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})