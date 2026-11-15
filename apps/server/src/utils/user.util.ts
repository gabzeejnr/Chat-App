import type { User } from "@chat-app/shared";
import type { DatabaseUserData } from "../types/index.js";

function toUser(user: DatabaseUserData): User;
function toUser(users: DatabaseUserData[]): User[];
function toUser(input: DatabaseUserData | DatabaseUserData[]): User | User[] {
    if (Array.isArray(input)) {
        return input.map(u => toUser(u)) as User[];
    }

    return {
        userId: input.id,
        username: input.username,
        displayName: input.display_name,
        email: input.email,
        avatarUrl: input.avatar_url
    };
}


function validateEmail(email: string): boolean {
    const test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return test.test(email)
}



export { toUser, validateEmail }