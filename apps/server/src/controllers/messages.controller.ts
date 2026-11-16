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

async function getMessages(req: Request<{}, {}, {}, { friendshipId?: UUID }>, res: Response<ApiSuccess<Messages[] | Messages> | ApiError>): Promise<void> {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json(userIdError);
            return;
        }

        const { friendshipId } = req.query;
        if (!friendshipId) {
            res.status(400).json({ error: "Invalid request parameter." });
            return;
        }

        const { rows } = await pool.query<Messages>(`
            SELECT m.id, m.conversation_id, m.sender_id, m.content, m.created_at
            FROM messages m
            JOIN conversations c ON c.id = m.conversation_id
            JOIN friendships f ON f.id = c.friendship_id
            WHERE c.friendship_id = $1
              AND (f.user_one_id = $2 OR f.user_two_id = $2)
            ORDER BY m.created_at ASC
        `, [friendshipId, userId]);

        if (!rows.length) {
            const { rows: friendshipRows } = await pool.query<{ id: UUID }>(`
                SELECT id
                FROM friendships
                WHERE id = $1 AND (user_one_id = $2 OR user_two_id = $2)
            `, [friendshipId, userId]);

            if (!friendshipRows.length) {
                res.status(404).json({ error: "Friendship not found." });
                return;
            }
        }

        res.status(200).json({
            message: (rows.length
                ? "Messages fetched successfully."
                : "No messages found. Send a message to get started."
            ),
            data: rows
        });
    } catch (err) {
        console.error("Failed to fetch messages:", err);
        res.status(500).json(serverError);
    }
}

export { getMessages, sendMessage }