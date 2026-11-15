import { pool } from "../config/database.js";
import { toUser } from "../utils/user.util.js";
import type { Request, Response } from "express";
import type { DiscoverableUser, User } from "@chat-app/shared";
import type { ApiError, ApiSuccess, DatabaseUserData } from "../types/index.js";
import { getUserWithId } from "../repositories/users.js";

async function discoverUsers(req: Request, res: Response<ApiSuccess<DiscoverableUser[]> | ApiError>): Promise<void> {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "User authentication is required." })
            return;
        }

        const searchQuery = req.query.search;
        if (searchQuery !== undefined && typeof searchQuery !== "string") {
            res.status(400).json({ error: "Search must be a string." });
            return;
        }
        const search = searchQuery?.trim() ?? "";

        const { rows } = await pool.query<DatabaseUserData & {
            has_outgoing_request: boolean;
            has_incoming_request: boolean;
        }>(
            `SELECT u.id, u.username, u.display_name, u.avatar_url,
                EXISTS (
                    SELECT 1 FROM friend_requests fr
                    WHERE fr.status = 'pending'
                    AND fr.sender_id = $1
                    AND fr.receiver_id = u.id
                ) AS has_outgoing_request,
                EXISTS (
                    SELECT 1 FROM friend_requests fr
                    WHERE fr.status = 'pending'
                    AND fr.sender_id = u.id
                    AND fr.receiver_id = $1
                ) AS has_incoming_request
            FROM users u WHERE u.id <> $1
            AND NOT EXISTS (SELECT 1 FROM user_blocks b WHERE (b.blocker_id = $1 AND b.blocked_id = u.id) OR (b.blocker_id = u.id AND b.blocked_id = $1))
            AND ($2 = '' OR POSITION(LOWER($2) IN LOWER(u.display_name)) > 0 OR POSITION(LOWER($2) IN LOWER(u.username)) > 0)
            AND NOT EXISTS (
                SELECT 1 FROM friendships f
                WHERE f.user_one_id = LEAST($1::uuid, u.id)
                  AND f.user_two_id = GREATEST($1::uuid, u.id)
            )`,
            [userId, search]
        )

        const users = rows.map(row => ({
            ...toUser(row),
            hasOutgoingRequest: row.has_outgoing_request,
            hasIncomingRequest: row.has_incoming_request
        }));

        res.status(200).json({
            message: (users.length
                ? "Users gotten successfully"
                : "No discoverable users found"
            ),
            data: users
        })
    } catch (err) {
        console.error("Couldn't load users:", err);
        res.status(500).json({ error: "Internal server error" })
    }
}

async function getUser(req: Request<{ id: DatabaseUserData["id"] }>, res: Response<ApiSuccess<User> | ApiError>) {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "User authentication is required." })
            return;
        }

        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: "userId not provided." })
            return;
        }

        const user = await getUserWithId(id);
        if (!user) {
            res.status(404).json({ error: "User not found." })
            return;
        }

        res.status(200).json({
            message: "User found.",
            data: user
        })
    } catch (err) {
        console.error("Couldn't load user data:", err);
        res.status(500).json({ error: "Internal server error" })
    }
}


export { discoverUsers, getUser }