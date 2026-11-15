import type { UUID } from "node:crypto";
import type { User } from "@chat-app/shared";
import type { JwtPayload } from "jsonwebtoken";

interface DatabaseUser {
    id: UUID;
    username: string;
    email: string;
    password: string;
    display_name: string;
    avatar_url: URL | string;
    is_verified: boolean;
    created_at: string;
    updated_at: string | Date["toISOString"];
}


interface RegisterUser {
    username: string;
    email: string;
    password: string;
    displayName: string
}

interface LoginUser {
    email: string;
    password: string;
}

interface DatabaseUserData {
    id: UUID;
    username: string;
    display_name: string;
    email: string;
    avatar_url: string;
}

interface WithPassword extends User {
    password: string
}

interface AccessTokenPayload extends JwtPayload {
    userId: UUID
    purpose: "access"
}


export type {
    AccessTokenPayload,
    DatabaseUser, DatabaseUserData, LoginUser,
    RegisterUser, WithPassword
}