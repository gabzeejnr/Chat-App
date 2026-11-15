import bcrypt from "bcrypt";
import { pool } from "../config/database.js";
const SALT_ROUNDS = 10;


function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS)
}

function verifyPassword(email: string, password: string, hashedPassword: string): Promise<boolean>
function verifyPassword(email: string, password: string): Promise<boolean | null>
async function verifyPassword(email: string, password: string, hashedPassword?: string): Promise<boolean | null> {
    let hash = hashedPassword;

    if (hash === undefined) {
        const { rows } = await pool.query<{ password: string }>(
            `SELECT password FROM users WHERE email = $1`,
            [email]
        );
        const user = rows[0];
        if (!user) return null;
        hash = user.password;
    }

    return bcrypt.compare(password, hash);
}

function testPasswordStrength(password: string): boolean {
    const isLongEnough = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    let strength: number = 0;

    if (isLongEnough) strength++;
    if (hasSpecial) strength++;
    if (hasUppercase) strength++;
    if (hasLowercase) strength++;
    if (hasNumber) strength++;

    return strength >= 5
}


export { hashPassword, verifyPassword, testPasswordStrength }