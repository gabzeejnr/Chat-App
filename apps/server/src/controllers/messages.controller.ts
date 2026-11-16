import { serverError, userIdError } from "../libs/index.js";
import type { UUID } from "node:crypto";
import type { Request, Response } from "express";
import type { ApiError, ApiSuccess } from "../types/index.js";
import { pool } from "../config/database.js";

async function sendMessage(req: Request<{}, {}, {}, { friendshipId?: UUID }>, res: Response<ApiSuccess | ApiError>): Promise<void> {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json(userIdError);
            return;
        }

        const { friendshipId } = req.query;
        if (!friendshipId) {
            res.status(400).json({ error: "Invalid request parameter." })
            return;
        }



    } catch (err) {
        console.error("Failed to send message:", err);
        res.status(500).json(serverError)
    }
}

async function getMessages(req: Request, res: Response) {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json(userIdError);
            return;
        }

        const { friendshipId } = req.query;
        if (!friendshipId) {
            res.status(400).json({ error: "Invalid request parameter." })
            return;
        }

        const { rows } = await pool.query(
            `SELECT * FROM messages m INNER JOIN `
        )

    } catch (err) {
        console.error("Failed to send message:", err);
        res.status(500).json(serverError)
    }
}

export { getMessages, sendMessage }