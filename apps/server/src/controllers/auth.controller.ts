import { randomUUID } from "node:crypto";
import { JWT_SECRET } from "../config/env.js";
import { DatabaseError } from "pg";
import { getUser, getUserWithId, saveUser, usernameFound, userRegistered } from "../repositories/index.js";
import { toUser, validateEmail } from "../utils/index.js";
import { clearTokenCookie, hashPassword, setTokenCookie, testPasswordStrength, verifyPassword } from "../helpers/index.js";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import type { Server } from "socket.io";
import type { User } from "@chat-app/shared";
import type { ApiError, ApiSuccess, LoginUser, RegisterUser } from "../types/index.js";
import type { LoginInput, RegistrationInput } from "../apis/auth/index.js";

async function registerUser(_req: Request<{}, {}, RegisterUser>, res: Response<ApiSuccess<User> | ApiError>): Promise<void> {
    try {

        const { email, password, username } = res.locals.validatedBody as RegistrationInput;
        let { displayName } = res.locals.validatedBody as RegistrationInput;
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();

        if (!normalizedEmail || !normalizedUsername || !password) {
            res.status(400).json({ error: "Email, username and password are required." });
            return
        }

        if (!validateEmail(normalizedEmail)) {
            res.status(400).json({ error: "Invalid email format." })
            return;
        }

        const isRegisterd = await userRegistered(normalizedEmail);
        if (isRegisterd) {
            res.status(409).json({ error: "Email already registered. Please use another email or login." })
            return;
        }

        const _username = await usernameFound(normalizedUsername)
        if (_username) {
            res.status(409).json({ error: "Username found. Please use another username or login." })
            return;
        }
        displayName = displayName?.trim() || normalizedUsername;

        const strength = testPasswordStrength(password);
        if (!strength) {
            res.status(400).json({ error: "Password strength too low." })
            return
        }
        const hashedPassword = await hashPassword(password);
        const id = randomUUID();


        const newUser = await saveUser({
            id,
            username: normalizedUsername,
            email: normalizedEmail,
            displayName,
            password: hashedPassword,
            avatarUrl: ""
        });

        const user = toUser(newUser)

        res.status(201).json({
            message: "User created successfully.",
            data: user
        })
    } catch (err) {
        if (err instanceof DatabaseError && err.code === "23505") {
            console.warn(`Unique violation on table ${err.table}: ${err.detail}`)
            console.warn(`Validated constraint: ${err.constraint}`)

            if (err.constraint?.includes('email')) {
                res.status(409).json({ error: "Email already registered. Please use another email or login." });
                return;
            }
            if (err.constraint?.includes('username')) {
                res.status(409).json({ error: "Username found. Please use another username or login." });
                return;
            }

            res.status(409).json({ error: "Email or username already exists. Please try another." });
            return;
        }

        console.error("Couldn't create user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function loginUser(_req: Request<{}, {}, LoginUser>, res: Response<ApiSuccess<User> | ApiError>): Promise<void> {
    try {
        const { email, password } = res.locals.validatedBody as LoginInput;

        if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
            res.status(400).json({ error: "Email and password are required." });
            return;
        }
        const normalizedEmail = email.trim().toLowerCase();

        if (!validateEmail(normalizedEmail)) {
            res.status(400).json({ error: "Invalid email format." });
            return;
        }

        const user = await getUser(normalizedEmail, { password: true });
        if (!user) {
            res.status(401).json({ error: "Invalid email or password." })
            return;
        }

        const isPasswordValid = await verifyPassword(normalizedEmail, password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password." });
            return;
        }


        const data = {
            userId: user.userId,
            email: user.email,
            displayName: user.displayName,
            username: user.username,
            avatarUrl: user.avatarUrl
        }

        const token = jwt.sign(
            { userId: data.userId, purpose: "access" },
            JWT_SECRET,
            {
                expiresIn: "1d",
                algorithm: "HS256"
            }
        )

        setTokenCookie(res, "accessToken", token, 1000 * 60 * 60 * 24)

        res.status(200).json({
            message: "Login successful.",
            data
        });
    } catch (err) {
        console.error("Couldn't verify user:", err);
        res.status(500).json({ error: "Internal server error" });
    }
}

async function getMe(_req: Request, res: Response<ApiSuccess<User> | ApiError>) {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Couldn't find user. Please try again." });
            return;
        }

        const user = await getUserWithId(userId);
        if (!user) {
            res.status(401).json({ error: "Couldn't find user. Please try again." });
            return;
        }

        res.status(200).json({
            message: "Fetched me successfully.",
            data: user
        })
    } catch (err) {
        console.error("Couldn't authenticate me:", err);
        res.status(500).json({ error: "Internal server error." })
    }
}

async function logOut(req: Request, res: Response<ApiSuccess | ApiError>) {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json({ error: "Couldn't find user. Please try again." });
            return;
        }

        const io = req.app.get("io") as Server;
        clearTokenCookie(res, "accessToken");
        io.in(userId).disconnectSockets(true);

        res.status(200).json({ message: "Connection closed... I think." })
    } catch (err) {
        console.error("Couldn't log user out:", err)
        res.status(500).json({ error: "Internal server error." })
    }
}

export { registerUser, loginUser, getMe, logOut }