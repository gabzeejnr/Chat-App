import { pool } from "../config/database.js";
import type { UUID } from "node:crypto";
import type { User } from "@chat-app/shared";
import type { DatabaseUserData, WithPassword } from "../types/users.types.js";
import { toUser } from "../utils/user.util.js";


async function userRegistered(email: string): Promise<boolean> {
    const { rows } = await pool.query(`SELECT email from users WHERE email = $1`, [email])
    if (rows.length === 0) return false;
    return true;
}

async function saveUser({ id, username, email, displayName, password, avatarUrl }: { id: UUID, username: string, email: string, displayName: string, password: string, avatarUrl: string }): Promise<DatabaseUserData> {
    const { rows } = await pool.query(`INSERT INTO users(id, username, email, display_name, password, avatar_url)
        VALUES($1, $2, $3, $4, $5, $6) RETURNING id, username, display_name, email, avatar_url`,
        [id, username, email, displayName, password, avatarUrl]
    )

    return rows[0]
}

async function usernameFound(username: string): Promise<boolean> {
    const { rows } = await pool.query<{ username: string }>(`SELECT username FROM users WHERE username = $1`, [username])
    if (rows.length !== 0) return true;
    return false
}


interface GetUserOptions {
    password: true
}

async function getUser(email: string, options: GetUserOptions): Promise<WithPassword | null>
async function getUser(email: string, options?: undefined): Promise<User | null>
async function getUser(email: string, options?: GetUserOptions): Promise<User | WithPassword | null> {
    const columns = "id, username, email, display_name, avatar_url";
    const query = `SELECT ${columns}${options?.password ? ", password" : ""} FROM users WHERE email = $1`;
    const { rows } = await pool.query<DatabaseUserData & { password?: string }>(query, [email]);
    const userData = rows[0];

    if (!userData) return null;

    const user = toUser(userData);
    if (options?.password) {
        if (typeof userData.password !== "string") {
            throw new Error("User query did not return the password.");
        }
        return { ...user, password: userData.password };
    }

    return user;
}

async function getUserWithId(userId: string): Promise<User | null> {
    const { rows } = await pool.query<DatabaseUserData>(`SELECT id, username, email, display_name, avatar_url FROM users WHERE id = $1`,
        [userId]
    )
    if (rows.length === 0) return null;
    const userData = rows[0];
    if (!userData) return null;

    const user = toUser(userData);
    return user
}

export { getUser, saveUser, usernameFound, userRegistered, getUserWithId }