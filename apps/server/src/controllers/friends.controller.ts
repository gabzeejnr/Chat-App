import { randomUUID } from "node:crypto";
import { pool } from "../config/database.js";
import { userIdError } from "../libs/error.libs.js";
import { sendFriendRequestFunc } from "../repositories/friends.repository.js";
import type { Request, Response } from "express";
import type { PoolClient } from "pg";
import type { CollectionMeta, Friend, FriendRequest as FriendRequestDto, PaginatedApiSuccess } from "@chat-app/shared";
import type { ApiError, ApiSuccess, DatabaseFriendship, FriendRequest, FriendRow, GetFriendRequests, PaginationMeta } from "../types/index.js";
import type { AcceptFriendRequestInput, RejectFriendRequestInput, SendFriendRequestInput } from "../apis/friends.js";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function parsePagination(pageParam?: string, limitParam?: string) {
    const page = pageParam === undefined ? DEFAULT_PAGE : Number(pageParam);
    const limit = limitParam === undefined ? DEFAULT_LIMIT : Number(limitParam);
    const offset = (page - 1) * limit;
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT || !Number.isSafeInteger(offset)) {
        return null;
    }

    return { page, limit, offset };
}

function createCollectionMeta(page: number, limit: number, total: number, count: number): CollectionMeta {
    const totalPages = Math.ceil(total / limit);
    const pagination: PaginationMeta = {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
    };

    return { total, count, pagination };
}

async function getFriend(req: Request<{}, {}, {}, {
    friendshipId?: string;
    page?: string;
    limit?: string | number;
    username?: string;
}>, res: Response<ApiSuccess<Friend | Friend[], CollectionMeta> | ApiError>): Promise<void> {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json(userIdError);
            return;
        }
        let data: FriendRow[];
        const { friendshipId } = req.query;
        if (friendshipId) {
            const { rows } = await pool.query<FriendRow>(
                `SELECT f.id AS friendship_id, u.id AS user_id, u.username,
                    COALESCE(u.display_name, u.username) AS display_name,
                    COALESCE(u.avatar_url, '') AS avatar_url
                FROM friendships f
                JOIN users u ON u.id = CASE
                    WHEN f.user_one_id = $2 THEN f.user_two_id
                    ELSE f.user_one_id
                END
                WHERE f.id = $1 AND (f.user_one_id = $2 OR f.user_two_id = $2)`,
                [friendshipId, userId]
            );
            data = rows;
        } else {
            const pagination = parsePagination(
                req.query.page,
                req.query.limit === undefined ? undefined : String(req.query.limit)
            );
            if (!pagination) {
                res.status(400).json({ error: "Page and limit must be positive integers, and limit cannot exceed 100." });
                return;
            }

            const { rows: countRows } = await pool.query<{ total: string }>(
                `SELECT COUNT(*) AS total FROM friendships WHERE user_one_id = $1 OR user_two_id = $1`,
                [userId]
            );
            const total = Number(countRows[0]?.total ?? 0);
            const query = `SELECT f.id AS friendship_id, u.id AS user_id, u.username,
                COALESCE(u.display_name, u.username) AS display_name,
                COALESCE(u.avatar_url, '') AS avatar_url
            FROM friendships f
            JOIN users u ON u.id = CASE
                WHEN f.user_one_id = $1 THEN f.user_two_id
                ELSE f.user_one_id
            END
            WHERE f.user_one_id = $1 OR f.user_two_id = $1
            ORDER BY f.created_at DESC, f.id DESC
            LIMIT $2 OFFSET $3`;
            const values = [userId, pagination.limit, pagination.offset];
            const { rows } = await pool.query<FriendRow>(query, values);
            data = rows;
            const meta = createCollectionMeta(pagination.page, pagination.limit, total, rows.length);
            res.status(200).json({
                message: rows.length ? "Friends fetched successfully." : "No friends found.",
                data: rows.map(row => ({
                    friendshipId: row.friendship_id,
                    userId: row.user_id,
                    username: row.username,
                    displayName: row.display_name,
                    avatarUrl: row.avatar_url
                })),
                meta
            });
            return;
        }

        if (friendshipId && !data.length) {
            res.status(404).json({ error: "Friendship not found." });
            return;
        }

        const friends: Friend[] = data.map(row => ({
            friendshipId: row.friendship_id,
            userId: row.user_id,
            username: row.username,
            displayName: row.display_name,
            avatarUrl: row.avatar_url
        }));

        res.status(200).json({
            message: (friends.length
                ? "Friends fetched successfully."
                : "No friends found."
            ),
            data: (friendshipId
                ? friends[0]!
                : friends
            )
        });
    } catch (err) {
        console.error("Couldn't get friend data:", err);
        res.status(500).json({ error: "Internal server error." });
    }
}

async function getFriendRequests(req: Request<{}, {}, {}, { page?: string; limit?: string }>, res: Response<PaginatedApiSuccess<FriendRequestDto[]> | ApiError>) {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json(userIdError);
            return;
        }

        const pagination = parsePagination(req.query.page, req.query.limit);
        if (!pagination) {
            res.status(400).json({ error: "Page and limit must be positive integers, and limit cannot exceed 100." });
            return;
        }

        const { rows: countRows } = await pool.query<{ total: string }>(
            `SELECT COUNT(*) AS total FROM friend_requests WHERE receiver_id = $1 AND status = 'pending'`,
            [userId]
        );
        const total = Number(countRows[0]?.total ?? 0);
        const { rows } = await pool.query<GetFriendRequests>(`SELECT fr.id, fr.sender_id, fr.receiver_id, fr.status, fr.created_at, u.username, u.display_name, u.avatar_url
                FROM friend_requests fr JOIN users u ON u.id = fr.sender_id WHERE fr.receiver_id = $1
                AND fr.status = 'pending' ORDER BY fr.created_at DESC, fr.id DESC LIMIT $2 OFFSET $3`,
            [userId, pagination.limit, pagination.offset]
        )

        const requests: FriendRequestDto[] = rows.map(row => ({
            id: row.id,
            senderId: row.sender_id,
            receiverId: row.receiver_id,
            status: row.status,
            createdAt: row.created_at.toISOString(),
            username: row.username,
            displayName: row.display_name ?? row.username,
            avatarUrl: row.avatar_url
        }));

        res.status(200).json({
            message: "Requests fetched successfully.",
            data: requests,
            meta: createCollectionMeta(pagination.page, pagination.limit, total, requests.length)
        })
    } catch (err) {
        console.error("Couldn't get friend requests:", err);
        res.status(500).json({ error: "Internal server error." });
    }
}

async function sendFriendRequest(_req: Request, res: Response<ApiSuccess<FriendRequest> | ApiError>): Promise<void> {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json(userIdError);
            return;
        }
        const { receiverId } = res.locals.validatedBody as SendFriendRequestInput;

        if (userId === receiverId) {
            res.status(400).json({ error: "Can't send requests to yourself." })
            return;
        }

        const requestId = randomUUID();
        const result = await sendFriendRequestFunc(requestId, userId, receiverId);
        if (!result.success) {
            res.status(result.status).json({ error: result.error })
            return;
        }

        res.status(201).json({
            message: "Friend request sent successfully.",
            data: result.data
        })
    } catch (err) {
        console.error("Couldn't send friend request:", err);
        res.status(500).json({ error: "Internal server error." });
    }
}

async function acceptFriendRequest(_req: Request, res: Response<ApiSuccess<DatabaseFriendship> | ApiError>) {
    let transactionStarted = false;
    let client: PoolClient | null = null;
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json(userIdError);
            return;
        }
        const { requestId } = res.locals.validatedBody as AcceptFriendRequestInput;

        client = await pool.connect();
        await client.query("BEGIN");
        transactionStarted = true;

        const { rows: requestData } = await client.query<{ sender_id: DatabaseFriendship["id"] }>(`
            UPDATE friend_requests
            SET status = 'accepted', updated_at = NOW()
            WHERE id = $1 AND receiver_id = $2 AND status = 'pending'
            RETURNING sender_id`,
            [requestId, userId]
        );

        const request = requestData[0];
        if (!request) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            res.status(404).json({ error: "Friend request not found or already processed." });
            return;
        }

        const [userOne, userTwo] = [userId, request.sender_id].sort();
        const { rows } = await client.query<DatabaseFriendship>(`
            INSERT INTO friendships (user_one_id, user_two_id)
            VALUES ($1, $2)
            RETURNING *`,
            [userOne, userTwo]
        )

        const friendship = rows[0];
        if (!friendship) {
            await client.query("ROLLBACK");
            transactionStarted = false;
            res.status(400).json({ error: "You are already friends with this user." });
            return;
        }

        await client.query("COMMIT");
        transactionStarted = false
        res.status(200).json({
            message: "Request accepted.",
            data: friendship
        })
    } catch (err) {
        if (client && transactionStarted) {
            await client.query("ROLLBACK").catch(e => console.error("Rollback failed:", e));
            transactionStarted = false;
        }

        console.error("Error accepting friend request:", err);
        res.status(500).json({ error: "Internal server error." });
    } finally {
        client?.release();
    }
}

async function rejectFriendRequest(_req: Request, res: Response<ApiSuccess<{ id: FriendRequest["id"]; status: FriendRequest["status"] }> | ApiError>) {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json(userIdError);
            return;
        }

        const { requestId } = res.locals.validatedBody as RejectFriendRequestInput;
        const { rows } = await pool.query<{ id: FriendRequest["id"]; status: FriendRequest["status"] }>(`
            UPDATE friend_requests
            SET status = 'rejected', updated_at = NOW()
            WHERE id = $1 AND receiver_id = $2 AND status = 'pending'
            RETURNING id, status`,
            [requestId, userId]
        );

        const request = rows[0];
        if (!request) {
            res.status(404).json({ error: "Friend request not found or already processed." });
            return;
        }

        res.status(200).json({
            message: "Friend request rejected.",
            data: request
        });
    } catch (err) {
        console.error("Error rejecting friend request:", err);
        res.status(500).json({ error: "Internal server error." });
    }
}






export { getFriend, getFriendRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest }