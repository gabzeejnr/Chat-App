import { Pool } from "pg";
import { DATABASE_PORT } from "./env.js";
import type { QueryResult } from "pg";

const pool = new Pool({
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    port: DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    connectionString: process.env.DATABASE_CONNECTION_STRING
})

try {
    const { rows }: QueryResult<{ start_time: string }> = await pool.query("SELECT NOW() AS start_time");
    console.log("Database connected successfully\nStart time:", rows[0]?.start_time.toString());
} catch (err) {
    console.error("Database connection failed:", err);
}


export { pool }