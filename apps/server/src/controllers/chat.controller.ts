import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import type { Request, Response } from "express";
import type { ApiError, ApiSuccess } from "../types/api.types.js";

const messagesPath = path.resolve(__dirname, "../data/message.json");

function addMessage(req: Request, res: Response<ApiSuccess | ApiError>) {
    try {
        const messagesData = await readFile(messagesPath)
    } catch (err) {
        console.log("Failed to send message:", err);
        res.status(500).json({ error: "Internal server error" })
    }
}