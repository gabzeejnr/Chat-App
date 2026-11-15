import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Request, Response } from "express";
import type { ApiError, ApiSuccess } from "../types/api.types.js";

const messagesPath = path.resolve(__dirname, "../data/message.json");

interface Messages {
    id: string;
    role: "user" | "friend";
    content: string;
}

async function addMessage(req: Request<{}, {}, { message: Messages }>, res: Response<ApiSuccess | ApiError>) {
    try {
        const messagesData = await readFile(messagesPath, "utf-8");
        const messages: Messages[] = JSON.parse(messagesData);

        const { message } = req.body;
        messages.push(message)

        await writeFile(messagesPath,
            JSON.stringify(messages, null, 2),
            "utf-8"
        )

        res.status(201).json({ message: "Done" })
    } catch (err) {
        console.log("Failed to send message:", err);
        res.status(500).json({ error: "Internal server error" })
    }
}

export { addMessage }