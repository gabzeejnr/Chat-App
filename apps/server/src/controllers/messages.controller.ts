import { pool } from "../config/database.js";
import { serverError, userIdError } from "../libs/index.js";
import type { UUID } from "node:crypto";
import type { Request, Response } from "express";
import type { ApiError, ApiSuccess, Messages } from "../types/index.js";

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

async function getMessages(req: Request, res: Response<ApiSuccess | ApiError>) {
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

        const { rows } = await pool.query<Messages>(
            `SELECT * FROM messages m INNER JOIN conversations c ON c.id = m.conversation_id WHERE c.friendship_id = $1`,
            [friendshipId]
        )

        res.status(200).json({
            message: (rows.length
                ? "Messages fetched successfully"
                : "No messages found. Send a message to get started."
            ),
            data: rows
        })

    } catch (err) {
        console.error("Failed to send message:", err);
        res.status(500).json(serverError)
    }
}

export { getMessages, sendMessage }