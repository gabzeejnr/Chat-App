import { pool } from "../config/database.js";
import { serverError, userIdError } from "../libs/index.js";
import type { Request, Response } from "express";
import type { PoolClient } from "pg";
import type { ClientMessage, UUID } from "@chat-app/shared";
import type { ApiError, ApiSuccess, Messages } from "../types/index.js";
import type { SendMessageInput } from "../apis/conversations.js";
import type { Server } from "socket.io";


async function sendMessage(req: Request<{ friendshipId: UUID }, {}, { content: string }>, res: Response<ApiSuccess<ClientMessage> | ApiError>): Promise<void> {
    const userId = res.locals.user?.userId;

    if (!userId) {
        res.status(401).json(userIdError);
        return;
    }

    const { friendshipId } = req.params;
    const { content } = res.locals.validatedBody as SendMessageInput

    if (!friendshipId || !content) {
        res.status(400).json({ error: "A friendship ID and message content are required." });
        return;
    }

    let client: Awaited<PoolClient> | null = null

    try {
        client = await pool.connect();
        await client.query("BEGIN");

        const { rows: friendshipRows } = await client.query<{ user_one_id: UUID, user_two_id: UUID }>(
            `SELECT user_one_id, user_two_id FROM friendships WHERE id = $1 AND (user_one_id = $2 OR user_two_id = $2)`,
            [friendshipId, userId]
        );

        if (!friendshipRows.length) {
            await client.query("ROLLBACK");
            res.status(404).json({ error: "Friendship not found." });
            return;
        }

        const recipientId = (friendshipRows[0]?.user_one_id === userId
            ? friendshipRows[0]!.user_two_id
            : friendshipRows[0]!.user_one_id
        )

        await client.query(
            `INSERT INTO conversations (friendship_id) VALUES ($1) ON CONFLICT (friendship_id) DO NOTHING`,
            [friendshipId]
        );

        const { rows: conversationRows } = await client.query<{ id: Messages["id"] }>(
            `SELECT id FROM conversations WHERE friendship_id = $1`,
            [friendshipId]
        );

        const conversationId = conversationRows[0]!.id;

        const { rows } = await client.query<Messages>(
            `INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3)
            RETURNING id, conversation_id, sender_id, content, created_at`,
            [conversationId, userId, content]
        );

        await client.query("COMMIT");

        const message: ClientMessage = {
            id: rows[0]!.id,
            conversationId: rows[0]!.conversation_id,
            senderId: rows[0]!.sender_id,
            content: rows[0]!.content,
            createdAt: rows[0]!.created_at
        }

        const io = req.app.get("io") as Server;
        io.to(recipientId).emit("message:new", {
            friendshipId,
            message
        })

        res.status(201).json({
            message: "Message sent successfully.",
            data: message
        });

    } catch (err) {
        if (client) {
            await client.query("ROLLBACK").catch(e => console.error(e));
        }

        console.error("Failed to send message:", err);
        res.status(500).json(serverError);

    } finally {
        client?.release();
    }
}


async function getMessages(req: Request<{ friendshipId?: UUID }>, res: Response<ApiSuccess<ClientMessage[] | ClientMessage> | ApiError>): Promise<void> {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json(userIdError);
            return;
        }

        const { friendshipId } = req.params;
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

        const messages = rows.map(row => ({
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            content: row.content,
            createdAt: row.created_at
        }))

        res.status(200).json({
            message: (rows.length
                ? "Messages fetched successfully."
                : "No messages found. Send a message to get started."
            ),
            data: messages
        });
    } catch (err) {
        console.error("Failed to fetch messages:", err);
        res.status(500).json(serverError);
    }
}

export { getMessages, sendMessage }