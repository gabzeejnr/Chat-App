import dotenv from "dotenv";
dotenv.config({path: "../../.env"})
import { env } from "node:process";

function requireEnv(name: string, env: string | undefined) {
    if (!env) throw new Error(`${name.toUpperCase()} is required`)
    return env;
}

const DATABASE_PORT = Number(requireEnv("DATABASE_PORT", env.DATABASE_PORT));
const JWT_SECRET = requireEnv("JWT_SECRET", env.JWT_SECRET)

export { dotenv, DATABASE_PORT, JWT_SECRET }