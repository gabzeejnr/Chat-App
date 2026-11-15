import type { UUID } from "node:crypto";
import { pool } from "../config/database.js";
import type { FriendRequest } from "../types/index.js";


type SendFriendRequestResult = { success: true; data: FriendRequest } | {
    success: false;
    status: 403 | 404 | 409;
    error: string;
};

async function sendFriendRequestFunc(requestId: UUID, userId: UUID, receiverId: UUID | string): Promise<SendFriendRequestResult> {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const userIds = [userId, receiverId].sort();
        const { rows: existingUsers } = await client.query<{ id: UUID }>(
            `SELECT id FROM users WHERE id = ANY($1::uuid[]) ORDER BY id FOR UPDATE`,
            [userIds]
        );

        if (existingUsers.length !== 2) {
            await client.query("ROLLBACK");
            return {
                success: false,
                status: 404,
                error: "User not found."
            };
        }

        const { rows: blocks } = await client.query(
            `SELECT id FROM user_blocks WHERE (blocker_id = $1 AND blocked_id = $2) OR (blocker_id = $2 AND blocked_id = $1) LIMIT 1`,
            [userId, receiverId]
        );

        if (blocks.length) {
            await client.query("ROLLBACK");
            return {
                success: false,
                status: 403,
                error: "You cannot send a friend request to this user."
            };
        }

        const [userOne, userTwo] = userIds;

        const { rows: friendships } = await client.query(
            `SELECT id FROM friendships WHERE user_one_id = $1 AND user_two_id = $2 LIMIT 1`,
            [userOne, userTwo]
        );

        if (friendships.length) {
            await client.query("ROLLBACK");
            return {
                success: false,
                status: 409,
                error: "You are already friends with this user."
            };
        }

        const { rows: pendingRequests } = await client.query(
            `SELECT id FROM friend_requests WHERE status = 'pending' AND (
                   (sender_id = $1 AND receiver_id = $2)
                   OR (sender_id = $2 AND receiver_id = $1)
               ) LIMIT 1`,
            [userId, receiverId]
        );

        if (pendingRequests.length) {
            await client.query("ROLLBACK");
            return {
                success: false,
                status: 409,
                error: "A pending friend request already exists."
            };
        }

        const { rows: rejectedRequests } = await client.query(
            `SELECT id FROM friend_requests WHERE status = 'rejected' AND (
                   (sender_id = $1 AND receiver_id = $2)
                   OR (sender_id = $2 AND receiver_id = $1)
               )
               AND updated_at >= NOW() - INTERVAL '7 days' ORDER BY updated_at DESC LIMIT 1`,
            [userId, receiverId]
        );

        if (rejectedRequests.length) {
            await client.query("ROLLBACK");
            return {
                success: false,
                status: 409,
                error: "You must wait seven days before sending another request."
            };
        }

        const { rows } = await client.query<FriendRequest>(
            `INSERT INTO friend_requests (id, sender_id, receiver_id) VALUES ($1, $2, $3) RETURNING *`,
            [requestId, userId, receiverId]
        );

        const data = rows[0];
        if (!data) throw new Error("Friend request insertion returned no data.")

        await client.query("COMMIT");
        return { success: true, data };
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}




export { sendFriendRequestFunc }